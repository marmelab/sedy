var crypto = require('crypto');

function* reply(githubApi, content, message) {
    if (content.type === 'pull_request_review_comment') {
        yield githubApi.replyToPullRequestReviewComment({
            repoUser: content.repository.user,
            repoName: content.repository.name,
            pullRequestNumber: content.pullRequest.number,
            commentId: content.comment.id,
            message: message,
        });
    }
}

function fixBlob(content, blob, treeBlob, match) {
    var newBlobContent;
    var buffer = new Buffer(blob.content, blob.encoding);
    var blobContent = buffer.toString('ascii');
    var index = content.comment.position - 1;

    var lines = blobContent.split('\n');
    var line = lines[index];

    var regex = new RegExp(match.from, 'gi');
    var newLine = line.replace(regex, match.to);

    if (line === newLine) {
        return null;
    }

    lines[index] = newLine;
    newBlobContent = (new Buffer(lines.join('\n'))).toString(blob.encoding);

    return {
        'path': treeBlob.path,
        'content': newBlobContent,
        // SHA1 Checksum ID
        'sha': crypto.createHash('sha1').update(newBlobContent, 'utf8').digest('hex'),
        'mode': treeBlob.mode,
        'type': treeBlob.type,
    };
}

function* fixMatch(githubApi, content, match) {
    var index;
    var blob;
    var modifiedFile = null; // Until challenged

    var lastCommit = yield githubApi.getCommitFromId({
        repoUser: content.repository.user,
        repoName: content.repository.name,
        commitId: content.commit.id,
    });

    var lastCommitTree = yield githubApi.getTreeFromId({
        repoUser: content.repository.user,
        repoName: content.repository.name,
        id: lastCommit.tree.sha,
    });

    for (index = 0; index < lastCommitTree.tree.length; index++) {
        blob = lastCommitTree.tree[index];
        if (blob.path === content.comment.path) {
            modifiedFile = yield githubApi.getBlobFromId({
                repoUser: content.repository.user,
                repoName: content.repository.name,
                id: blob.sha,
            });
        }
    }

    if (modifiedFile === null) {
        return null;
    }

    return fixBlob(content, modifiedFile, blob, match);
}

module.exports = function* fixer(content, githubApi) {
    var index;
    var match;
    var fix;
    var fixes = [];

    if (content === null || content.matches <= 0) {
        return null;
    }

    yield reply(githubApi, content,
                'Hi @' + content.comment.sender + '! ' +
                'I noticed a typo in your PR. I\'ll try to help you.');

    for (index = 0; index < content.matches.length; index++) {
        match = content.matches[index];
        fix = yield fixMatch(githubApi, content, match);
        if (fix) {
            fixes.push(fix);
        }
    }

    if (fixes.length <= 0) {
        yield reply(githubApi, content,
                    'Sorry @' + content.comment.sender + ', ' +
                    'I wasn\'t able to fix your typo :sob:');
        return null;
    }

    return {
        'content': content,
        'fixes': fixes,
    };
};
