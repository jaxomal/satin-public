import * as parser from "@babel/parser";
import * as t from '@babel/types';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import { readFileSync, writeFileSync } from 'fs';
import btoa from 'btoa';
import walk from 'walk';

const files  = [];

// Walker options
const walker = walk.walk('./build/src', { followLinks: false });

walker.on('file', function(root, stat, next) {
  files.push(root + '/' + stat.name);
  next();
});

walker.on('end', function() {
  for (const file of files) {
    if (file.endsWith('.js')) {
      protect(file);
    }
  }
});


const protect = (path) => {
  console.log(path);
  const source = readFileSync(path, 'utf-8');
  const ast = parser.parse(source);
  traverse(ast, {
    StringLiteral(path) {
      if (path) {
        const node = path.node;
        const parentNode = path.parentPath.node;
        if (parentNode.type === 'CallExpression') {
          const callee = parentNode.callee.name;
          if (callee !== 'require') {
            if (isNaN(node.value)) {
              const func = t.callExpression(t.identifier('atob'), [t.StringLiteral(btoa(node.value))]);
              path.replaceWith(func);
              path.skip()
            }
          }
        } else if (parentNode.type === 'ObjectProperty' || parentNode.type === 'ObjectMethod') {
          path.skip();
        } else {
          if (isNaN(node.value)) {
            const func = t.callExpression(t.identifier('atob'), [t.StringLiteral(btoa(node.value))]);
            path.replaceWith(func);
            path.skip()
          }
        }
      }
    },
  });
  traverse(ast,{
    VariableDeclarator(path) {
      if (path.node.id.name === 'atob') {
        path.remove();
      }
    }
  }),
  traverse(ast, {  
    Program(path) {
      path.get('body.0').insertBefore(t.variableDeclaration('const', [t.variableDeclarator(t.identifier('atob'), t.callExpression(t.identifier('require'), [t.StringLiteral('atob')]))]));
    },
  })
  writeFileSync(path, generate(ast, {}, source).code)
}

// protect(readFileSync('./build/src/index.js', 'utf-8'))