const WORDS = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it',
  'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this',
  'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or',
  'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so',
  'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when',
  'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people',
  'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than',
  'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back',
  'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even',
  'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us', 'is'
];

const CODE_SNIPPETS = {
  javascript: [
    'function calculateSum(a, b) {\n  return a + b;\n}',
    'const array = [1, 2, 3, 4, 5];\nconst doubled = array.map(x => x * 2);',
    'for (let i = 0; i < 10; i++) {\n  console.log(i);\n}',
    'if (condition) {\n  doSomething();\n} else {\n  doSomethingElse();\n}',
    'const user = {\n  name: "John",\n  age: 30,\n  email: "john@example.com"\n};',
    'async function fetchData() {\n  const response = await fetch(url);\n  return response.json();\n}'
  ],
  python: [
    'def calculate_sum(a, b):\n    return a + b',
    'numbers = [1, 2, 3, 4, 5]\ndoubled = [x * 2 for x in numbers]',
    'for i in range(10):\n    print(i)',
    'if condition:\n    do_something()\nelse:\n    do_something_else()',
    'user = {\n    "name": "John",\n    "age": 30,\n    "email": "john@example.com"\n}',
    'class Person:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age'
  ],
  java: [
    'public int calculateSum(int a, int b) {\n    return a + b;\n}',
    'for (int i = 0; i < 10; i++) {\n    System.out.println(i);\n}',
    'if (condition) {\n    doSomething();\n} else {\n    doSomethingElse();\n}',
    'public class Person {\n    private String name;\n    private int age;\n}',
    'int[] numbers = {1, 2, 3, 4, 5};'
  ],
  c: [
    'int calculate_sum(int a, int b) {\n    return a + b;\n}',
    'for (int i = 0; i < 10; i++) {\n    printf("%d\\n", i);\n}',
    'if (condition) {\n    do_something();\n}',
    'struct Person {\n    char name[50];\n    int age;\n};'
  ],
  cpp: [
    'int calculateSum(int a, int b) {\n    return a + b;\n}',
    'for (int i = 0; i < 10; i++) {\n    cout << i << endl;\n}',
    'if (condition) {\n    doSomething();\n}',
    'class Person {\nprivate:\n    string name;\n    int age;\n};'
  ]
};

export const generateNormalText = (wordCount = 50) => {
  const words = [];
  for (let i = 0; i < wordCount; i++) {
    words.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
  }
  return words.join(' ');
};

export const generateCodeText = (language = 'javascript') => {
  const snippets = CODE_SNIPPETS[language] || CODE_SNIPPETS.javascript;
  return snippets[Math.floor(Math.random() * snippets.length)];
};
