import isASCII from './isASCII';

const regex = new RegExp('(^s\/|.*?\\ss\/)(.*?())\/(.*?)\/.*?', 'g');

export default comment => {
    const matches = [];
    let match = regex.exec(comment);

    while (match) {
        if (isASCII(match[2]) && isASCII(match[4])) {
            matches.push({ from: match[2], to: match[4] });
        }
        match = regex.exec(comment);
    }

    return matches;
};
