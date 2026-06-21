// Batch 4: Stack (Q31-Q40)
var BATCH4 = [
{id:31,topic:"Stack",pattern:"Monotonic Stack",title:"Next Greater Element I",difficulty:"easy",
intuition:"Use decreasing monotonic stack. For each element, pop smaller elements — current element is their NGE.",
visual:"[4,1,2] in [1,3,4,2]\nProcess right→left: stack=[]\n2→stack=[2], NGE[2]=-1\n4→pop 2, stack=[4], NGE[4]=-1\n3→stack=[3,4], NGE[3]=4\n1→stack=[1,3,4], NGE[1]=3",
steps:["Iterate nums2, maintain decreasing stack","For each num, pop all smaller from stack","Those popped nums have current as NGE","Push current onto stack","Lookup NGE for nums1 elements via map"],
code:`class Solution {
    public int[] nextGreaterElement(int[] nums1, int[] nums2) {
        Map<Integer, Integer> map = new HashMap<>();
        Deque<Integer> stack = new ArrayDeque<>();
        for (int n : nums2) {
            while (!stack.isEmpty() && stack.peek() < n)
                map.put(stack.pop(), n);
            stack.push(n);
        }
        int[] res = new int[nums1.length];
        for (int i = 0; i < nums1.length; i++)
            res[i] = map.getOrDefault(nums1[i], -1);
        return res;
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(n)",
mistakes:["Using nested loops O(n²) for each element","Processing left-to-right without stack","Forgetting elements left in stack have NGE = -1"],
trick:"🧠 'Monotonic stack = NGE machine! Pop smaller, they found their bigger buddy. Push current.'"
},
{id:32,topic:"Stack",pattern:"Monotonic Stack",title:"Daily Temperatures",difficulty:"medium",
intuition:"Monotonic decreasing stack of indices. For each temp, pop colder days — distance is the answer for those days.",
visual:"[73,74,75,71,69,72,76,73]\nDay 0(73): stack=[0]\nDay 1(74): pop 0, ans[0]=1-0=1, stack=[1]\nDay 2(75): pop 1, ans[1]=1, stack=[2]\nDay 3(71): stack=[2,3]...",
steps:["Stack stores indices","For each day i","Pop indices where temp[stack.top] < temp[i]","ans[popped] = i - popped","Push i onto stack"],
code:`class Solution {
    public int[] dailyTemperatures(int[] temp) {
        int n = temp.length;
        int[] ans = new int[n];
        Deque<Integer> stack = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            while (!stack.isEmpty() && temp[stack.peek()] < temp[i]) {
                int idx = stack.pop();
                ans[idx] = i - idx;
            }
            stack.push(i);
        }
        return ans;
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(n)",
mistakes:["Storing values instead of indices in stack","Using >= instead of < (depends on problem semantics)","Not initializing answer array to 0 (it is by default in Java)"],
trick:"🧠 'Stack of INDICES, not values! Pop = found warmer day. Distance = current_idx - popped_idx.'"
},
{id:33,topic:"Stack",pattern:"Monotonic Stack",title:"Largest Rectangle in Histogram",difficulty:"hard",
intuition:"Monotonic increasing stack. When a shorter bar appears, pop and calculate area using popped bar as height.",
visual:"heights=[2,1,5,6,2,3]\nStack approach:\n  Pop 6 at idx 3: width=1, area=6\n  Pop 5 at idx 2: width=2, area=10 ★\n  Pop 1: width=6, area=6\nMax area = 10",
steps:["Push indices with increasing heights","On shorter bar: pop and compute area","Height = heights[popped]","Width = i - stack.peek() - 1","After loop, process remaining stack"],
code:`class Solution {
    public int largestRectangleArea(int[] h) {
        Deque<Integer> stack = new ArrayDeque<>();
        int max = 0, n = h.length;
        for (int i = 0; i <= n; i++) {
            int cur = (i == n) ? 0 : h[i];
            while (!stack.isEmpty() && h[stack.peek()] > cur) {
                int height = h[stack.pop()];
                int width = stack.isEmpty() ? i : i - stack.peek() - 1;
                max = Math.max(max, height * width);
            }
            stack.push(i);
        }
        return max;
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(n)",
mistakes:["Forgetting to process remaining elements (append 0 sentinel)","Width calculation when stack is empty (use i, not i-(-1)-1)","Not using monotonic increasing stack"],
trick:"🧠 'Increasing stack. Short bar triggers pop-and-calculate. Add sentinel 0 at end to flush stack!'"
},
{id:34,topic:"Stack",pattern:"Expression Evaluation",title:"Evaluate Reverse Polish Notation",difficulty:"medium",
intuition:"Stack-based evaluation. Numbers → push. Operators → pop two, compute, push result.",
visual:'["2","1","+","3","*"]\nPush 2, Push 1\n"+": pop 1,2 → push 3\nPush 3\n"*": pop 3,3 → push 9\nResult: 9',
steps:["Iterate tokens","If number → push to stack","If operator → pop b, pop a","Compute a op b","Push result back"],
code:`class Solution {
    public int evalRPN(String[] tokens) {
        Deque<Integer> stack = new ArrayDeque<>();
        for (String t : tokens) {
            if (t.length() > 1 || Character.isDigit(t.charAt(0))) {
                stack.push(Integer.parseInt(t));
            } else {
                int b = stack.pop(), a = stack.pop();
                switch (t.charAt(0)) {
                    case '+': stack.push(a + b); break;
                    case '-': stack.push(a - b); break;
                    case '*': stack.push(a * b); break;
                    case '/': stack.push(a / b); break;
                }
            }
        }
        return stack.pop();
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(n)",
mistakes:["Wrong operand order: a op b, where a is popped second","Not handling negative numbers (e.g., '-3' is a number not operator)","Integer division truncation toward zero"],
trick:"🧠 'RPN: see number→push. See operator→pop TWO, compute, push back. Stack shrinks on operators!'"
},
{id:35,topic:"Stack",pattern:"Parenthesis & Scoring",title:"Valid Parentheses",difficulty:"easy",
intuition:"Push opening brackets. For closing bracket, check if top of stack matches. Stack should be empty at end.",
visual:'"([{}])"\nPush ( → stack=[(]\nPush [ → stack=[(,[]\nPush { → stack=[(,[,{]\n} matches { → pop → stack=[(,[]  \n] matches [ → pop → stack=[(]\n) matches ( → pop → stack=[]\nEmpty → VALID!',
steps:["For each char","If opening → push","If closing → check stack top matches","If mismatch or stack empty → false","At end, stack must be empty"],
code:`class Solution {
    public boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '[') stack.push(']');
            else if (c == '{') stack.push('}');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(n)",
mistakes:["Not checking stack empty before popping","Forgetting to check stack is empty at end","Pushing the same bracket instead of its complement"],
trick:"🧠 'Push the EXPECTED closer! When you see closer, just check if it matches stack.pop(). Elegant!'"
},
{id:36,topic:"Stack",pattern:"Stack Simulation / Undo Operation",title:"Remove All Adjacent Duplicates in String",difficulty:"easy",
intuition:"Stack simulation: push chars, if top matches current → pop (remove pair). Build result from stack.",
visual:'"abbaca"\na→stack=[a]\nb→stack=[a,b]\nb→matches top! pop→stack=[a]\na→matches top! pop→stack=[]\nc→stack=[c]\na→stack=[c,a]\nResult: "ca"',
steps:["Iterate through string","If stack top == current char → pop","Else push current char","Build result from remaining stack"],
code:`class Solution {
    public String removeDuplicates(String s) {
        StringBuilder sb = new StringBuilder();
        for (char c : s.toCharArray()) {
            if (sb.length() > 0 && sb.charAt(sb.length()-1) == c)
                sb.deleteCharAt(sb.length()-1);
            else sb.append(c);
        }
        return sb.toString();
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(n)",
mistakes:["Only removing first occurrence of adjacent duplicates","Using actual Stack class (slow) instead of StringBuilder","Not handling chain reactions (stack handles naturally)"],
trick:"🧠 'StringBuilder AS a stack! Last char = top. Match → delete last. No match → append. Brilliant!'"
},
{id:37,topic:"Stack",pattern:"Stack-Based Design",title:"Min Stack",difficulty:"medium",
intuition:"Two stacks: main stack + min stack. Min stack tracks minimum at each level. Both push/pop in sync.",
visual:"push(3): main=[3], min=[3]\npush(1): main=[3,1], min=[3,1]\npush(5): main=[3,1,5], min=[3,1,1]\ngetMin()=1\npop(): main=[3,1], min=[3,1]\ngetMin()=1",
steps:["push(x): push to main; push min(x, minStack.top) to minStack","pop(): pop from both stacks","top(): return main stack top","getMin(): return min stack top","All operations O(1)"],
code:`class MinStack {
    Deque<Integer> stack = new ArrayDeque<>();
    Deque<Integer> minStack = new ArrayDeque<>();
    
    public void push(int val) {
        stack.push(val);
        minStack.push(minStack.isEmpty() ? val : Math.min(val, minStack.peek()));
    }
    public void pop() { stack.pop(); minStack.pop(); }
    public int top() { return stack.peek(); }
    public int getMin() { return minStack.peek(); }
}`,
timeComplexity:"O(1) all ops",spaceComplexity:"O(n)",
mistakes:["Only storing min when it changes (need to handle pop correctly)","Using single variable for min (breaks on pop)","Not handling empty stack edge case"],
trick:"🧠 'Two stacks in sync! Min stack always stores the current minimum at each depth level.'"
},
{id:38,topic:"Stack",pattern:"Stack + Greedy",title:"Remove K Digits",difficulty:"medium",
intuition:"Greedy + monotonic stack: remove digits that are larger than next digit. Keep smallest possible front digits.",
visual:'"1432219", k=3\n1→[1]\n4→[1,4]\n3→pop 4(k=2)→[1,3]\n2→pop 3(k=1)→[1,2]\n2→[1,2,2]\n1→pop 2(k=0)→[1,2,1]... → "1219"',
steps:["For each digit","While stack.top > current AND k>0 → pop (remove)","Push current digit","After loop, remove remaining k from end","Remove leading zeros, handle empty case"],
code:`class Solution {
    public String removeKdigits(String num, int k) {
        StringBuilder sb = new StringBuilder();
        for (char c : num.toCharArray()) {
            while (sb.length() > 0 && k > 0 && sb.charAt(sb.length()-1) > c) {
                sb.deleteCharAt(sb.length()-1);
                k--;
            }
            sb.append(c);
        }
        sb.setLength(sb.length() - k); // remove remaining k
        // remove leading zeros
        int start = 0;
        while (start < sb.length() && sb.charAt(start) == '0') start++;
        String res = sb.substring(start);
        return res.isEmpty() ? "0" : res;
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(n)",
mistakes:["Not removing remaining k digits from end","Forgetting to strip leading zeros","Returning empty string instead of '0'"],
trick:"🧠 'Greedy: bigger digit before smaller = remove the bigger one! Monotonic increasing stack of digits.'"
},
{id:39,topic:"Stack",pattern:"Parenthesis & Scoring",title:"Generate Parentheses",difficulty:"medium",
intuition:"Backtracking: add '(' if open < n, add ')' if close < open. Build all valid combinations.",
visual:'n=2\n(( → (() → (()) ✓\n(  → () → ()( → ()() ✓\nResult: ["(())","()()"]',
steps:["Backtrack with open count and close count","If open < n → add '(' and recurse","If close < open → add ')' and recurse","If length == 2n → add to result","Backtrack: remove last char"],
code:`class Solution {
    public List<String> generateParenthesis(int n) {
        List<String> res = new ArrayList<>();
        backtrack(res, new StringBuilder(), 0, 0, n);
        return res;
    }
    void backtrack(List<String> res, StringBuilder sb, int open, int close, int n) {
        if (sb.length() == 2 * n) { res.add(sb.toString()); return; }
        if (open < n) {
            sb.append('(');
            backtrack(res, sb, open+1, close, n);
            sb.deleteCharAt(sb.length()-1);
        }
        if (close < open) {
            sb.append(')');
            backtrack(res, sb, open, close+1, n);
            sb.deleteCharAt(sb.length()-1);
        }
    }
}`,
timeComplexity:"O(4^n/√n)",spaceComplexity:"O(n)",
mistakes:["Allowing close >= open (invalid parentheses)","Not backtracking (removing last char)","Generating all permutations then filtering (too slow)"],
trick:"🧠 'Two rules: open < n → can add (. close < open → can add ). Never more closes than opens!'"
},
{id:40,topic:"Stack",pattern:"Recursive Stack",title:"Sort a Stack (using Recursion)",difficulty:"medium",
intuition:"Pop all elements recursively. Insert each back in sorted position using another recursive function.",
visual:"stack=[3,1,4,2]\npop all: 3,1,4,2\ninsert 2: [2]\ninsert 4: [2,4]\ninsert 1: [1,2,4]\ninsert 3: [1,2,3,4] ✓",
steps:["Pop top element","Recursively sort remaining stack","Insert popped element in sorted position","sortedInsert: if stack empty or top <= element → push","Else pop top, insert element, push top back"],
code:`class Solution {
    public void sortStack(Stack<Integer> stack) {
        if (stack.isEmpty()) return;
        int top = stack.pop();
        sortStack(stack);
        sortedInsert(stack, top);
    }
    void sortedInsert(Stack<Integer> stack, int val) {
        if (stack.isEmpty() || stack.peek() <= val) {
            stack.push(val);
            return;
        }
        int top = stack.pop();
        sortedInsert(stack, val);
        stack.push(top);
    }
}`,
timeComplexity:"O(n²)",spaceComplexity:"O(n) recursion",
mistakes:["Not handling equal elements (use <= for stability)","Forgetting to push back the temporarily removed element","Stack overflow for very large stacks"],
trick:"🧠 'Pop everything out (recursion goes deep), then insert each back in the RIGHT spot. Like insertion sort on a stack!'"
}
];
