const path = require('path');
const fs = require('fs');
const package = require('./package.json');
let baseDir = path.resolve(__dirname);

while (true) {
    const isOk = fs.existsSync(path.resolve(baseDir, '../package.json'));
    baseDir = path.resolve(baseDir, '../');
    if (isOk) break;
}

const packageFile = path.resolve(baseDir, 'package.json');

const log = (info) => console.log(`${package.name}: ${info}`);

const mergePackage = () => {
    if (!fs.existsSync(packageFile)) return;
    let data = null;
    try {
        data = JSON.parse(fs.readFileSync(packageFile, 'utf-8'));
    } catch (e) {}
    if (!data) return;

    const config = {
        scripts: {
            ...(data.scripts || {}),
            lint: 'npm run lint:js && npm run lint:css',
            'lint:js': 'genesis-eslint . --ext .js,.ts,.vue --fix',
            'lint:css': 'genesis-stylelint **/*.{css,less,vue} --fix'
        },
        husky: {
            hooks: {
                'pre-commit': 'lint-staged'
            }
        },
        'lint-staged': {
            '*.{ts,js}': ['eslint --ext .js,.ts --fix', 'git add'],
            '*.{vue}': ['eslint --ext .js,.ts --fix', 'git add']
        }
    };
    Object.assign(data, config);
    const text = JSON.stringify(data, null, 4) + '\n';
    fs.writeFileSync(packageFile, text);
    log(`已合并： ${packageFile}`);
};

const createFile = ({ file, text, beforeCreate }) => {
    if (fs.existsSync(file)) {
        return log(`已存在: ${file}`);
    }
    if (typeof beforeCreate === 'function') {
        beforeCreate({ file, text, beforeCreate });
    }
    fs.writeFileSync(file, text);
    log(`已创建: ${file}`);
};

const initConfigFile = () => {
    const eslintrcFile = path.resolve(baseDir, '.eslintrc.js');
    const eslintignoreFile = path.resolve(baseDir, '.eslintignore');
    const gitignoreFile = path.resolve(baseDir, '.gitignore');
    const editorconfigFile = path.resolve(baseDir, '.editorconfig');
    const stylelintConfigFile = path.resolve(baseDir, 'stylelint.config.js');
    const stylelintignoreFile = path.resolve(baseDir, '.stylelintignore');
    const vsCodeFile = path.resolve(baseDir, '.vscode/settings.json');
    const list = [
        {
            file: eslintrcFile,
            text: `module.exports = {
    extends: [require.resolve('@fmfe/genesis-lint')]
};

`
        },
        {
            file: eslintignoreFile,
            text: `dist
node_modules
`
        },
        {
            file: gitignoreFile,
            text: `node_modules/**
**.log
dist
`
        },
        {
            file: editorconfigFile,
            text: `# http://editorconfig.org
root = true

[*]
#缩进风格：空格
indent_style = space
#缩进大小
indent_size = 4
#换行符lf
end_of_line = lf
#字符集utf-8
charset = utf-8
#是否删除行尾的空格
trim_trailing_whitespace = true
#是否在文件的最后插入一个空行
insert_final_newline = true
`
        },
        {
            file: stylelintConfigFile,
            text: `module.exports = {
    extends: [
        require.resolve('${package.name}/stylelint.config')
    ],
    rules: {
        // 添加你的自定义规则
    }
};
`
        },
        {
            file: stylelintignoreFile,
            text: `*.json
*.js
*.ts
*.png
*.eot
*.ttf
*.woff`
        },
        {
            file: vsCodeFile,
            beforeCreate({ file }) {
                const dir = path.resolve(file, '../');
                if (fs.existsSync(dir)) return;
                fs.mkdirSync(dir);
            },
            text: `{
    "stylelint.validate": [
        "css",
        "less",
        "html"
    ],
    "editor.codeActionsOnSave": {
        "source.fixAll": true
    }
}`
        }
    ];
    list.forEach((item) => {
        createFile(item);
    });
};

mergePackage();
initConfigFile();
