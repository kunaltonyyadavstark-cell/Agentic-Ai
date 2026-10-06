import { Router, Request, Response } from 'express';
import {Exercise} from '../models/Exercise';

const router = Router();

router.get('/seed', async (_req: Request, res: Response) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      success: false,
      error: 'Seeding is not allowed in production'
    });
  }

  try {
    const count = await Exercise.countDocuments();
    if (count > 0) {
      return res.json({
        success: true,
        message: `There are already ${count} exercises. Use /api/seed/force to replace them.`,
      });
    }

    const exercises = [
      // Arrays
      {
        title: 'Sum Two Numbers',
        description: 'Create a function that takes two numbers and returns their sum.',
        language: 'python',
        difficulty: 'easy',
        category: 'logic-math',
        tags: ['math', 'basic'],
        keywords: ['sum', 'addition', 'numbers'],
        starterCode: 'def sum_two(a, b):\n    # Your code here\n    pass',
        solution: 'def sum_two(a, b):\n    return a + b',
        testCases: [
          { input: '2, 3', expectedOutput: '5', description: 'Basic addition' },
          { input: '0, 0', expectedOutput: '0', description: 'Zero values' },
          { input: '-5, 5', expectedOutput: '0', description: 'Negative numbers' },
        ],
        hints: ['Think about the + operator', 'Return the sum directly'],
      },
      {
        title: 'Find Maximum',
        description: 'Find the maximum number in an array.',
        language: 'javascript',
        difficulty: 'easy',
        category: 'arrays',
        tags: ['arrays', 'max'],
        keywords: ['maximum', 'array', 'largest'],
        starterCode: 'function findMax(arr) {\n  // Your code here\n}',
        solution: 'function findMax(arr) {\n  return Math.max(...arr);\n}',
        testCases: [
          { input: '[1, 2, 3, 4, 5]', expectedOutput: '5', description: 'Ascending array' },
          { input: '[10, 5, 8, 3]', expectedOutput: '10', description: 'Unordered array' },
        ],
        hints: ['Use Math.max()', 'Spread operator can help'],
      },
      {
        title: 'Reverse Array',
        description: 'Reverse an array without using built-in reverse method.',
        language: 'python',
        difficulty: 'medium',
        category: 'arrays',
        tags: ['arrays', 'reverse'],
        keywords: ['reverse', 'array', 'swap'],
        starterCode: 'def reverse_array(arr):\n    # Your code here\n    pass',
        solution: 'def reverse_array(arr):\n    return arr[::-1]',
        testCases: [
          { input: '[1, 2, 3, 4]', expectedOutput: '[4, 3, 2, 1]', description: 'Basic reversal' },
        ],
        hints: ['Use slicing', 'Think about [::-1]'],
      },
      {
        title: 'Array Sum',
        description: 'Calculate the sum of all elements in an array.',
        language: 'javascript',
        difficulty: 'easy',
        category: 'arrays',
        tags: ['arrays', 'sum'],
        keywords: ['sum', 'array', 'total'],
        starterCode: 'function arraySum(arr) {\n  // Your code here\n}',
        solution: 'function arraySum(arr) {\n  return arr.reduce((a, b) => a + b, 0);\n}',
        testCases: [
          { input: '[1, 2, 3, 4]', expectedOutput: '10', description: 'Simple sum' },
        ],
        hints: ['Use reduce', 'Start with 0 as initial value'],
      },
      {
        title: 'Remove Duplicates',
        description: 'Remove duplicate elements from an array.',
        language: 'python',
        difficulty: 'medium',
        category: 'arrays',
        tags: ['arrays', 'duplicates'],
        keywords: ['duplicates', 'unique', 'set'],
        starterCode: 'def remove_duplicates(arr):\n    # Your code here\n    pass',
        solution: 'def remove_duplicates(arr):\n    return list(set(arr))',
        testCases: [
          { input: '[1, 2, 2, 3, 4, 4]', expectedOutput: '[1, 2, 3, 4]', description: 'Remove duplicates' },
        ],
        hints: ['Use set()', 'Convert back to list'],
      },
      {
        title: 'Merge Sorted Arrays',
        description: 'Merge two sorted arrays into one sorted array.',
        language: 'java',
        difficulty: 'hard',
        category: 'arrays',
        tags: ['arrays', 'sorting', 'merge'],
        keywords: ['merge', 'sorted', 'arrays'],
        starterCode: 'public int[] mergeSorted(int[] arr1, int[] arr2) {\n    // Your code here\n}',
        solution: 'public int[] mergeSorted(int[] arr1, int[] arr2) {\n    int[] result = new int[arr1.length + arr2.length];\n    int i = 0, j = 0, k = 0;\n    while (i < arr1.length && j < arr2.length) {\n        if (arr1[i] < arr2[j]) result[k++] = arr1[i++];\n        else result[k++] = arr2[j++];\n    }\n    while (i < arr1.length) result[k++] = arr1[i++];\n    while (j < arr2.length) result[k++] = arr2[j++];\n    return result;\n}',
        testCases: [
          { input: '[1, 3, 5], [2, 4, 6]', expectedOutput: '[1, 2, 3, 4, 5, 6]', description: 'Merge sorted' },
        ],
        hints: ['Use two pointers', 'Compare elements one by one'],
      },

      // Strings
      {
        title: 'Reverse String',
        description: 'Reverse a given string.',
        language: 'python',
        difficulty: 'easy',
        category: 'strings',
        tags: ['strings', 'reverse'],
        keywords: ['reverse', 'string'],
        starterCode: 'def reverse_string(s):\n    # Your code here\n    pass',
        solution: 'def reverse_string(s):\n    return s[::-1]',
        testCases: [
          { input: '"hello"', expectedOutput: '"olleh"', description: 'Reverse string' },
        ],
        hints: ['Use slicing', '[::-1]'],
      },
      {
        title: 'Palindrome Check',
        description: 'Check if a string is a palindrome.',
        language: 'javascript',
        difficulty: 'easy',
        category: 'strings',
        tags: ['strings', 'palindrome'],
        keywords: ['palindrome', 'string', 'check'],
        starterCode: 'function isPalindrome(s) {\n  // Your code here\n}',
        solution: 'function isPalindrome(s) {\n  return s === s.split("").reverse().join("");\n}',
        testCases: [
          { input: '"racecar"', expectedOutput: 'true', description: 'Palindrome' },
          { input: '"hello"', expectedOutput: 'false', description: 'Not palindrome' },
        ],
        hints: ['Compare string with its reverse', 'Use split, reverse, join'],
      },
      {
        title: 'Count Vowels',
        description: 'Count the number of vowels in a string.',
        language: 'python',
        difficulty: 'easy',
        category: 'strings',
        tags: ['strings', 'vowels'],
        keywords: ['vowels', 'count', 'string'],
        starterCode: 'def count_vowels(s):\n    # Your code here\n    pass',
        solution: 'def count_vowels(s):\n    return sum(1 for c in s.lower() if c in "aeiou")',
        testCases: [
          { input: '"hello"', expectedOutput: '2', description: 'Count vowels' },
        ],
        hints: ['Loop through string', 'Check if char in "aeiou"'],
      },
      {
        title: 'Anagram Check',
        description: 'Check if two strings are anagrams.',
        language: 'javascript',
        difficulty: 'medium',
        category: 'strings',
        tags: ['strings', 'anagram'],
        keywords: ['anagram', 'sort', 'string'],
        starterCode: 'function isAnagram(s1, s2) {\n  // Your code here\n}',
        solution: 'function isAnagram(s1, s2) {\n  return s1.split("").sort().join("") === s2.split("").sort().join("");\n}',
        testCases: [
          { input: '"listen", "silent"', expectedOutput: 'true', description: 'Anagram' },
        ],
        hints: ['Sort both strings', 'Compare sorted versions'],
      },
      {
        title: 'String Compression',
        description: 'Compress a string using counts of repeated characters.',
        language: 'python',
        difficulty: 'medium',
        category: 'strings',
        tags: ['strings', 'compression'],
        keywords: ['compression', 'string', 'count'],
        starterCode: 'def compress_string(s):\n    # Your code here\n    pass',
        solution: 'def compress_string(s):\n    if not s: return ""\n    result = []\n    count = 1\n    for i in range(1, len(s)):\n        if s[i] == s[i-1]:\n            count += 1\n        else:\n            result.append(s[i-1] + str(count))\n            count = 1\n    result.append(s[-1] + str(count))\n    return "".join(result)',
        testCases: [
          { input: '"aaabbc"', expectedOutput: '"a3b2c1"', description: 'Compress string' },
        ],
        hints: ['Count consecutive characters', 'Build result string'],
      },
      {
        title: 'Longest Substring',
        description: 'Find the length of the longest substring without repeating characters.',
        language: 'cpp',
        difficulty: 'hard',
        category: 'strings',
        tags: ['strings', 'substring', 'sliding-window'],
        keywords: ['substring', 'unique', 'longest'],
        starterCode: 'int lengthOfLongestSubstring(string s) {\n    // Your code here\n}',
        solution: 'int lengthOfLongestSubstring(string s) {\n    unordered_set<char> chars;\n    int left = 0, maxLen = 0;\n    for (int right = 0; right < s.length(); right++) {\n        while (chars.count(s[right])) {\n            chars.erase(s[left++]);\n        }\n        chars.insert(s[right]);\n        maxLen = max(maxLen, right - left + 1);\n    }\n    return maxLen;\n}',
        testCases: [
          { input: '"abcabcbb"', expectedOutput: '3', description: 'Longest substring' },
        ],
        hints: ['Use sliding window', 'Track seen characters'],
      },

      // Loops
      {
        title: 'FizzBuzz',
        description: 'Print numbers 1-100, but for multiples of 3 print "Fizz", for multiples of 5 print "Buzz", and for multiples of both print "FizzBuzz".',
        language: 'python',
        difficulty: 'easy',
        category: 'loops',
        tags: ['loops', 'fizzbuzz'],
        keywords: ['fizzbuzz', 'multiples', 'loop'],
        starterCode: 'def fizzbuzz():\n    # Your code here\n    pass',
        solution: 'def fizzbuzz():\n    for i in range(1, 101):\n        if i % 15 == 0:\n            print("FizzBuzz")\n        elif i % 3 == 0:\n            print("Fizz")\n        elif i % 5 == 0:\n            print("Buzz")\n        else:\n            print(i)',
        testCases: [
          { input: '', expectedOutput: 'First 15: 1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz', description: 'FizzBuzz pattern' },
        ],
        hints: ['Check multiples of 15 first', 'Then check 3 and 5'],
      },
      {
        title: 'Factorial',
        description: 'Calculate the factorial of a number using iteration.',
        language: 'javascript',
        difficulty: 'easy',
        category: 'loops',
        tags: ['loops', 'factorial'],
        keywords: ['factorial', 'multiplication', 'loop'],
        starterCode: 'function factorial(n) {\n  // Your code here\n}',
        solution: 'function factorial(n) {\n  let result = 1;\n  for (let i = 2; i <= n; i++) result *= i;\n  return result;\n}',
        testCases: [
          { input: '5', expectedOutput: '120', description: 'Factorial of 5' },
        ],
        hints: ['Start with result = 1', 'Multiply from 2 to n'],
      },
      {
        title: 'Fibonacci Sequence',
        description: 'Generate the first n Fibonacci numbers.',
        language: 'python',
        difficulty: 'medium',
        category: 'loops',
        tags: ['loops', 'fibonacci'],
        keywords: ['fibonacci', 'sequence', 'loop'],
        starterCode: 'def fibonacci(n):\n    # Your code here\n    pass',
        solution: 'def fibonacci(n):\n    if n <= 0: return []\n    if n == 1: return [0]\n    fib = [0, 1]\n    for i in range(2, n):\n        fib.append(fib[-1] + fib[-2])\n    return fib',
        testCases: [
          { input: '7', expectedOutput: '[0, 1, 1, 2, 3, 5, 8]', description: 'First 7 Fibonacci' },
        ],
        hints: ['Start with [0, 1]', 'Each number is sum of previous two'],
      },
      {
        title: 'Prime Numbers',
        description: 'Find all prime numbers up to n.',
        language: 'java',
        difficulty: 'medium',
        category: 'loops',
        tags: ['loops', 'primes'],
        keywords: ['prime', 'numbers', 'sieve'],
        starterCode: 'public List<Integer> findPrimes(int n) {\n    // Your code here\n}',
        solution: 'public List<Integer> findPrimes(int n) {\n    List<Integer> primes = new ArrayList<>();\n    for (int i = 2; i <= n; i++) {\n        boolean isPrime = true;\n        for (int j = 2; j <= Math.sqrt(i); j++) {\n            if (i % j == 0) { isPrime = false; break; }\n        }\n        if (isPrime) primes.add(i);\n    }\n    return primes;\n}',
        testCases: [
          { input: '10', expectedOutput: '[2, 3, 5, 7]', description: 'Primes up to 10' },
        ],
        hints: ['Check divisibility up to sqrt(n)', 'Skip even numbers after 2'],
      },

      // Data Structures
      {
        title: 'Stack Implementation',
        description: 'Implement a stack with push, pop, and peek operations.',
        language: 'python',
        difficulty: 'medium',
        category: 'data-structures',
        tags: ['stack', 'data-structures'],
        keywords: ['stack', 'push', 'pop'],
        starterCode: 'class Stack:\n    def __init__(self):\n        # Your code here\n        pass',
        solution: 'class Stack:\n    def __init__(self):\n        self.items = []\n    def push(self, item):\n        self.items.append(item)\n    def pop(self):\n        return self.items.pop() if self.items else None\n    def peek(self):\n        return self.items[-1] if self.items else None',
        testCases: [
          { input: 'push(1), push(2), pop()', expectedOutput: '2', description: 'Stack operations' },
        ],
        hints: ['Use a list', 'append() and pop()'],
      },
      {
        title: 'Queue Implementation',
        description: 'Implement a queue with enqueue and dequeue operations.',
        language: 'javascript',
        difficulty: 'medium',
        category: 'data-structures',
        tags: ['queue', 'data-structures'],
        keywords: ['queue', 'enqueue', 'dequeue'],
        starterCode: 'class Queue {\n  constructor() {\n    // Your code here\n  }\n}',
        solution: 'class Queue {\n  constructor() {\n    this.items = [];\n  }\n  enqueue(item) {\n    this.items.push(item);\n  }\n  dequeue() {\n    return this.items.shift();\n  }\n}',
        testCases: [
          { input: 'enqueue(1), enqueue(2), dequeue()', expectedOutput: '1', description: 'Queue operations' },
        ],
        hints: ['Use array', 'push() and shift()'],
      },
      {
        title: 'Linked List',
        description: 'Implement a singly linked list with insert and delete operations.',
        language: 'cpp',
        difficulty: 'hard',
        category: 'data-structures',
        tags: ['linked-list', 'data-structures'],
        keywords: ['linked-list', 'node', 'pointer'],
        starterCode: 'class Node {\npublic:\n    int data;\n    Node* next;\n};',
        solution: 'class LinkedList {\nprivate:\n    Node* head;\npublic:\n    LinkedList() : head(nullptr) {}\n    void insert(int data) {\n        Node* newNode = new Node();\n        newNode->data = data;\n        newNode->next = head;\n        head = newNode;\n    }\n};',
        testCases: [
          { input: 'insert(1), insert(2)', expectedOutput: '2 -> 1', description: 'Linked list' },
        ],
        hints: ['Track head pointer', 'Update pointers carefully'],
      },
      {
        title: 'Binary Tree Traversal',
        description: 'Implement inorder traversal of a binary tree.',
        language: 'python',
        difficulty: 'hard',
        category: 'data-structures',
        tags: ['tree', 'traversal'],
        keywords: ['binary-tree', 'traversal', 'inorder'],
        starterCode: 'def inorder(root):\n    # Your code here\n    pass',
        solution: 'def inorder(root):\n    if not root: return []\n    return inorder(root.left) + [root.val] + inorder(root.right)',
        testCases: [
          { input: 'Tree: 1->2->3', expectedOutput: '[2, 1, 3]', description: 'Inorder traversal' },
        ],
        hints: ['Recursion: left, root, right', 'Base case: null node'],
      },

      // Algorithms
      {
        title: 'Binary Search',
        description: 'Implement binary search on a sorted array.',
        language: 'python',
        difficulty: 'medium',
        category: 'algorithms',
        tags: ['search', 'binary-search'],
        keywords: ['binary-search', 'sorted', 'search'],
        starterCode: 'def binary_search(arr, target):\n    # Your code here\n    pass',
        solution: 'def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target: return mid\n        elif arr[mid] < target: left = mid + 1\n        else: right = mid - 1\n    return -1',
        testCases: [
          { input: '[1, 2, 3, 4, 5], 3', expectedOutput: '2', description: 'Find element' },
        ],
        hints: ['Use two pointers', 'Compare with middle element'],
      },
      {
        title: 'Bubble Sort',
        description: 'Implement bubble sort algorithm.',
        language: 'javascript',
        difficulty: 'easy',
        category: 'algorithms',
        tags: ['sorting', 'bubble-sort'],
        keywords: ['bubble-sort', 'sorting', 'swap'],
        starterCode: 'function bubbleSort(arr) {\n  // Your code here\n}',
        solution: 'function bubbleSort(arr) {\n  for (let i = 0; i < arr.length; i++) {\n    for (let j = 0; j < arr.length - 1 - i; j++) {\n      if (arr[j] > arr[j + 1]) {\n        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];\n      }\n    }\n  }\n  return arr;\n}',
        testCases: [
          { input: '[5, 2, 8, 1, 9]', expectedOutput: '[1, 2, 5, 8, 9]', description: 'Sort array' },
        ],
        hints: ['Nested loops', 'Swap adjacent elements'],
      },
      {
        title: 'Quick Sort',
        description: 'Implement quick sort algorithm.',
        language: 'python',
        difficulty: 'hard',
        category: 'algorithms',
        tags: ['sorting', 'quick-sort'],
        keywords: ['quick-sort', 'sorting', 'divide-conquer'],
        starterCode: 'def quick_sort(arr):\n    # Your code here\n    pass',
        solution: 'def quick_sort(arr):\n    if len(arr) <= 1: return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quick_sort(left) + middle + quick_sort(right)',
        testCases: [
          { input: '[5, 2, 8, 1, 9]', expectedOutput: '[1, 2, 5, 8, 9]', description: 'Sort array' },
        ],
        hints: ['Choose pivot', 'Partition array', 'Recursively sort'],
      },
      {
        title: 'Depth-First Search',
        description: 'Implement DFS for a graph.',
        language: 'java',
        difficulty: 'hard',
        category: 'algorithms',
        tags: ['graph', 'dfs'],
        keywords: ['dfs', 'graph', 'traversal'],
        starterCode: 'public void dfs(int[][] graph, int start) {\n    // Your code here\n}',
        solution: 'public void dfs(int[][] graph, int start) {\n    boolean[] visited = new boolean[graph.length];\n    dfsHelper(graph, start, visited);\n}\nprivate void dfsHelper(int[][] graph, int v, boolean[] visited) {\n    visited[v] = true;\n    System.out.print(v + " ");\n    for (int neighbor : graph[v]) {\n        if (!visited[neighbor]) dfsHelper(graph, neighbor, visited);\n    }\n}',
        testCases: [
          { input: 'Graph: 0-1-2', expectedOutput: '0 1 2', description: 'DFS traversal' },
        ],
        hints: ['Use recursion', 'Track visited nodes'],
      },

      // Logic & Math
      {
        title: 'Even or Odd',
        description: 'Check if a number is even or odd.',
        language: 'python',
        difficulty: 'easy',
        category: 'logic-math',
        tags: ['math', 'modulo'],
        keywords: ['even', 'odd', 'modulo'],
        starterCode: 'def is_even(n):\n    # Your code here\n    pass',
        solution: 'def is_even(n):\n    return n % 2 == 0',
        testCases: [
          { input: '4', expectedOutput: 'True', description: 'Even number' },
          { input: '5', expectedOutput: 'False', description: 'Odd number' },
        ],
        hints: ['Use modulo operator %', 'n % 2 == 0 for even'],
      },
      {
        title: 'Power of Two',
        description: 'Check if a number is a power of 2.',
        language: 'javascript',
        difficulty: 'easy',
        category: 'logic-math',
        tags: ['math', 'bitwise'],
        keywords: ['power', 'bitwise', 'math'],
        starterCode: 'function isPowerOfTwo(n) {\n  // Your code here\n}',
        solution: 'function isPowerOfTwo(n) {\n  return n > 0 && (n & (n - 1)) === 0;\n}',
        testCases: [
          { input: '8', expectedOutput: 'true', description: 'Power of 2' },
          { input: '6', expectedOutput: 'false', description: 'Not power of 2' },
        ],
        hints: ['Use bitwise AND', 'n & (n-1) == 0 for powers of 2'],
      },
      {
        title: 'GCD (Greatest Common Divisor)',
        description: 'Find the GCD of two numbers using Euclidean algorithm.',
        language: 'python',
        difficulty: 'medium',
        category: 'logic-math',
        tags: ['math', 'gcd'],
        keywords: ['gcd', 'euclidean', 'algorithm'],
        starterCode: 'def gcd(a, b):\n    # Your code here\n    pass',
        solution: 'def gcd(a, b):\n    while b:\n        a, b = b, a % b\n    return a',
        testCases: [
          { input: '48, 18', expectedOutput: '6', description: 'GCD' },
        ],
        hints: ['Use Euclidean algorithm', 'Keep dividing until remainder is 0'],
      },
      {
        title: 'LCM (Least Common Multiple)',
        description: 'Find the LCM of two numbers.',
        language: 'javascript',
        difficulty: 'medium',
        category: 'logic-math',
        tags: ['math', 'lcm'],
        keywords: ['lcm', 'multiple', 'math'],
        starterCode: 'function lcm(a, b) {\n  // Your code here\n}',
        solution: 'function lcm(a, b) {\n  const gcd = (x, y) => y === 0 ? x : gcd(y, x % y);\n  return (a * b) / gcd(a, b);\n}',
        testCases: [
          { input: '4, 6', expectedOutput: '12', description: 'LCM' },
        ],
        hints: ['Use formula: LCM(a,b) = (a*b) / GCD(a,b)', 'Calculate GCD first'],
      },
      {
        title: 'Prime Check',
        description: 'Check if a number is prime.',
        language: 'python',
        difficulty: 'easy',
        category: 'logic-math',
        tags: ['math', 'prime'],
        keywords: ['prime', 'number', 'divisibility'],
        starterCode: 'def is_prime(n):\n    # Your code here\n    pass',
        solution: 'def is_prime(n):\n    if n < 2: return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0: return False\n    return True',
        testCases: [
          { input: '7', expectedOutput: 'True', description: 'Prime number' },
          { input: '8', expectedOutput: 'False', description: 'Not prime' },
        ],
        hints: ['Check divisibility up to sqrt(n)', 'Numbers < 2 are not prime'],
      },
      {
        title: 'Square Root',
        description: 'Calculate square root using Newton\'s method.',
        language: 'cpp',
        difficulty: 'hard',
        category: 'logic-math',
        tags: ['math', 'newton'],
        keywords: ['square-root', 'newton', 'approximation'],
        starterCode: 'double sqrt(double n) {\n    // Your code here\n}',
        solution: 'double sqrt(double n) {\n    if (n == 0) return 0;\n    double x = n;\n    double y = (x + 1) / 2;\n    while (y < x) {\n        x = y;\n        y = (x + n / x) / 2;\n    }\n    return x;\n}',
        testCases: [
          { input: '16', expectedOutput: '4', description: 'Square root' },
        ],
        hints: ['Use Newton\'s method', 'Iterate until convergence'],
      },
    ];

    await Exercise.insertMany(exercises);

    res.json({
      success: true,
      message: `✅ ${exercises.length} exercises created successfully`,
      count: exercises.length,
    });
  } catch (error: any) {
    console.error('Error en seed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error while seeding exercises',
    });
  }
});

// Force seed (elimina y redirige al seed normal for reinsertar)
router.get('/seed/force', async (_req: Request, res: Response) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      success: false,
      error: 'Seeding is not allowed in production'
    });
  }

  try {
    await Exercise.deleteMany({});
    return res.redirect('/api/seed');
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;