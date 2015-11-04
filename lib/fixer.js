var crypto = require('crypto');

function* reply(githubapi, content, message) {
    if (content.type === 'pull_request_review_comment') {
        yield githubapi.replyToPullRequestReviewComment({
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

function* fixMatch(githubapi, content, match) {
    var index;
    var blob;
    var modifiedFile = null; // Until challenged

    var lastCommit = yield githubapi.getCommitFromId({
        repoUser: content.repository.user,
        repoName: content.repository.name,
        commitId: content.commit.id,
    });

    var lastCommitTree = yield githubapi.getTreeFromId({
        repoUser: content.repository.user,
        repoName: content.repository.name,
        id: lastCommit.tree.sha,
    });

    for (index = 0; index < lastCommitTree.tree.length; index++) {
        blob = lastCommitTree.tree[index];
        if (blob.path === content.comment.path) {
            modifiedFile = yield githubapi.getBlobFromId({
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

module.exports = function* fixer(content, githubapi) {
    var index;
    var match;
    var fix;
    var fixes = [];

    if (content === null || content.matches <= 0) {
        return null;
    }

    yield reply(githubapi, content,
                'Hi @' + content.comment.sender + '! ' +
                'I see that you would fix mistyped syntax. I\'ll try to help you.');

    for (index = 0; index < content.matches.length; index++) {
        match = content.matches[index];
        fix = yield fixMatch(githubapi, content, match);
        if (fix) {
            fixes.push(fix);
        }
    }

    if (fixes.length <= 0) {
        yield reply(githubapi, content,
                    'Sorry @' + content.comment.sender + ', ' +
                    'I have not been able to execute your fix :sob:');
        return null;
    }

    return {
        'content': content,
        'fixes': fixes,
    };
};
