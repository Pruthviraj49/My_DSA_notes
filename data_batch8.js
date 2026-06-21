// Batch 8: Heap + Backtracking (Q77-Q86)
var BATCH8 = [
{id:77,topic:"Heap",pattern:"Top-K Elements",title:"Kth Largest Element in Array",difficulty:"medium",
intuition:"Min-heap of size k. Process all elements. Heap top = kth largest. Or use QuickSelect for O(n) average.",
visual:"[3,2,1,5,6,4], k=2\nMin-heap (size 2):\nProcess: 3→[3] 2→[2,3] 1→skip 5→[3,5] 6→[5,6] 4→skip\nHeap top = 5 = 2nd largest!",
steps:["Create min-heap of size k","Add elements to heap","If heap size > k → remove minimum","After processing all → heap top is kth largest"],
code:`class Solution {
    public int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        for (int n : nums) {
            pq.offer(n);
            if (pq.size() > k) pq.poll();
        }
        return pq.peek();
    }
}`,
timeComplexity:"O(n log k)",spaceComplexity:"O(k)",
mistakes:["Using max-heap of all elements O(n log n)","Sorting entire array when only kth needed","QuickSelect is O(n) avg but O(n²) worst"],
trick:"🧠 'Min-heap of size k = top-k filter! Small ones fall out the bottom. Peek = kth largest survivor.'"
},
{id:78,topic:"Heap",pattern:"Merge K Sorted",title:"Merge K Sorted Lists",difficulty:"hard",
intuition:"Min-heap with one node from each list. Poll smallest, add its next node. Builds merged list in order.",
visual:"L1:1→4→5  L2:1→3→4  L3:2→6\nHeap: [1,1,2] → poll 1(L1)\nHeap: [1,2,4] → poll 1(L2)\nHeap: [2,3,4] → poll 2(L3)...\nResult: 1→1→2→3→4→4→5→6",
steps:["Add head of each list to min-heap","Poll minimum node","Append to result list","If polled node has next → add next to heap","Repeat until heap empty"],
code:`class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        PriorityQueue<ListNode> pq = new PriorityQueue<>((a,b) -> a.val - b.val);
        for (ListNode l : lists)
            if (l != null) pq.offer(l);
        ListNode dummy = new ListNode(0), curr = dummy;
        while (!pq.isEmpty()) {
            ListNode node = pq.poll();
            curr.next = node;
            curr = curr.next;
            if (node.next != null) pq.offer(node.next);
        }
        return dummy.next;
    }
}`,
timeComplexity:"O(N log k)",spaceComplexity:"O(k)",
mistakes:["Adding null lists to heap","Not providing comparator for ListNode","Merging two at a time O(Nk) instead of heap O(N log k)"],
trick:"🧠 'K-way merge = min-heap with k entries! Always poll smallest across all lists. Add its successor.'"
},
{id:79,topic:"Heap",pattern:"Heap with Sliding Window",title:"Sliding Window Maximum",difficulty:"hard",
intuition:"Use monotonic deque (not heap). Maintain decreasing order. Front = max of window. Remove expired indices.",
visual:"[1,3,-1,-3,5,3,6,7], k=3\nDeque: [3] → max=3\nDeque: [3,-1] → max=3\nDeque: [5] → max=5\nDeque: [5,3] → max=5...",
steps:["Deque stores indices in decreasing order of values","For each element: remove smaller from back","Remove expired indices from front (i-k)","Front of deque = window maximum","Collect results after first k-1 elements"],
code:`class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        int[] res = new int[nums.length - k + 1];
        Deque<Integer> dq = new ArrayDeque<>();
        for (int i = 0; i < nums.length; i++) {
            while (!dq.isEmpty() && dq.peekFirst() < i - k + 1)
                dq.pollFirst();
            while (!dq.isEmpty() && nums[dq.peekLast()] < nums[i])
                dq.pollLast();
            dq.offerLast(i);
            if (i >= k - 1)
                res[i - k + 1] = nums[dq.peekFirst()];
        }
        return res;
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(k)",
mistakes:["Using max-heap O(n log n) instead of deque O(n)","Not removing expired indices from front","Storing values instead of indices (can't check expiry)"],
trick:"🧠 'Monotonic DEQUE, not heap! Decreasing from front. Front = max. Remove expired from front, smaller from back.'"
},
{id:80,topic:"Heap",pattern:"Implementation of Heap",title:"Design a Max Heap",difficulty:"medium",
intuition:"Array-based. Parent at i, children at 2i+1, 2i+2. Insert at end + bubble up. Remove top + bubble down.",
visual:"Insert 5,3,8,1,4:\n     8          Remove max(8):\n    / \\              5\n   4   5            / \\\n  / \\              4   3\n 1   3            /\n                 1",
steps:["insert: add at end, siftUp","extractMax: swap root with last, remove last, siftDown","siftUp: compare with parent, swap if larger","siftDown: compare with children, swap with larger child","peek: return root"],
code:`class MaxHeap {
    List<Integer> heap = new ArrayList<>();
    public void insert(int val) {
        heap.add(val); siftUp(heap.size()-1);
    }
    public int extractMax() {
        int max = heap.get(0);
        int last = heap.remove(heap.size()-1);
        if (!heap.isEmpty()) { heap.set(0, last); siftDown(0); }
        return max;
    }
    void siftUp(int i) {
        while (i > 0) {
            int p = (i-1)/2;
            if (heap.get(i) > heap.get(p)) {
                Collections.swap(heap, i, p); i = p;
            } else break;
        }
    }
    void siftDown(int i) {
        int n = heap.size();
        while (2*i+1 < n) {
            int j = 2*i+1;
            if (j+1 < n && heap.get(j+1) > heap.get(j)) j++;
            if (heap.get(i) < heap.get(j)) {
                Collections.swap(heap, i, j); i = j;
            } else break;
        }
    }
}`,
timeComplexity:"O(log n) insert/extract",spaceComplexity:"O(n)",
mistakes:["Wrong parent/child index formulas","Not checking both children in siftDown","Removing from front instead of swapping with last"],
trick:"🧠 'Parent=(i-1)/2, Children=2i+1,2i+2. Insert→siftUp. Extract→swap root with last→siftDown.'"
},
{id:81,topic:"Heap",pattern:"Huffman pattern",title:"Minimum Cost to Connect Sticks",difficulty:"medium",
intuition:"Always merge two smallest sticks. Use min-heap. Cost = sum of each merge. Greedy minimizes total cost.",
visual:"sticks=[2,4,3]\nMerge 2+3=5 (cost 5)\nMerge 5+4=9 (cost 9)\nTotal cost = 14\n\nIf merge 3+4=7, then 7+2=9 → cost=16 (worse!)",
steps:["Add all sticks to min-heap","While heap size > 1","Poll two smallest","Merge (sum) and add cost","Push merged stick back"],
code:`class Solution {
    public int connectSticks(int[] sticks) {
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        for (int s : sticks) pq.offer(s);
        int cost = 0;
        while (pq.size() > 1) {
            int merged = pq.poll() + pq.poll();
            cost += merged;
            pq.offer(merged);
        }
        return cost;
    }
}`,
timeComplexity:"O(n log n)",spaceComplexity:"O(n)",
mistakes:["Merging largest first (greedy wants smallest first!)","Not adding merged stick back to heap","This is exactly Huffman coding — same pattern!"],
trick:"🧠 'Huffman pattern: always merge the TWO SMALLEST! Min-heap makes greedy choice automatic.'"
},
{id:82,topic:"Backtracking",pattern:"Choice-Based Backtracking",title:"Permutations",difficulty:"medium",
intuition:"For each position, try every unused number. Mark as used, recurse, unmark (backtrack).",
visual:"[1,2,3]\n1→12→123✓ backtrack→13→132✓\n2→21→213✓ backtrack→23→231✓\n3→31→312✓ backtrack→32→321✓",
steps:["Track used elements with boolean array","For each position, try all unused elements","Mark used, add to current permutation","Recurse for next position","Backtrack: unmark, remove from current"],
code:`class Solution {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        backtrack(res, new ArrayList<>(), nums, new boolean[nums.length]);
        return res;
    }
    void backtrack(List<List<Integer>> res, List<Integer> cur, int[] nums, boolean[] used) {
        if (cur.size() == nums.length) { res.add(new ArrayList<>(cur)); return; }
        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true;
            cur.add(nums[i]);
            backtrack(res, cur, nums, used);
            cur.remove(cur.size() - 1);
            used[i] = false;
        }
    }
}`,
timeComplexity:"O(n·n!)",spaceComplexity:"O(n)",
mistakes:["Not using visited/used array → duplicates","Forgetting to backtrack (unmark used)","Using swap-based approach incorrectly"],
trick:"🧠 'Permutation = try EACH unused element at current position. used[] prevents reuse. Backtrack = undo!'"
},
{id:83,topic:"Backtracking",pattern:"Constraint-Based Backtracking",title:"N-Queens",difficulty:"hard",
intuition:"Place queens row by row. Check column, diagonal, anti-diagonal constraints. Backtrack if no valid position.",
visual:"N=4:\n.Q..    ..Q.\n...Q    Q...\nQ...    ...Q\n..Q.    .Q..\nTwo solutions!",
steps:["Place queen in each row one by one","Track used columns, diagonals, anti-diagonals","For each column in current row","Check if safe (no conflicts)","Place → recurse → backtrack"],
code:`class Solution {
    public List<List<String>> solveNQueens(int n) {
        List<List<String>> res = new ArrayList<>();
        Set<Integer> cols = new HashSet<>(), diag = new HashSet<>(), anti = new HashSet<>();
        char[][] board = new char[n][n];
        for (char[] r : board) Arrays.fill(r, '.');
        solve(res, board, 0, n, cols, diag, anti);
        return res;
    }
    void solve(List<List<String>> res, char[][] board, int row, int n,
               Set<Integer> cols, Set<Integer> diag, Set<Integer> anti) {
        if (row == n) {
            List<String> sol = new ArrayList<>();
            for (char[] r : board) sol.add(new String(r));
            res.add(sol); return;
        }
        for (int c = 0; c < n; c++) {
            if (cols.contains(c) || diag.contains(row-c) || anti.contains(row+c)) continue;
            board[row][c] = 'Q';
            cols.add(c); diag.add(row-c); anti.add(row+c);
            solve(res, board, row+1, n, cols, diag, anti);
            board[row][c] = '.';
            cols.remove(c); diag.remove(row-c); anti.remove(row+c);
        }
    }
}`,
timeComplexity:"O(n!)",spaceComplexity:"O(n²)",
mistakes:["Not tracking diagonals (row-col) and anti-diagonals (row+col)","Checking entire board instead of using sets","Not backtracking board state"],
trick:"🧠 'Row by row placement. Track 3 things: columns, diag(row-col), anti-diag(row+col). Sets for O(1) check!'"
},
{id:84,topic:"Backtracking",pattern:"Grid / Path Backtracking",title:"Word Search",difficulty:"medium",
intuition:"DFS from each cell. Try all 4 directions. Mark visited. If word[idx] matches, continue. Backtrack on dead end.",
visual:'board: [A,B,C,E]    word: "ABCCED"\n       [S,F,C,S]\n       [A,D,E,E]\nPath: A(0,0)→B(0,1)→C(0,2)→C(1,2)→E(2,2)→D(2,1) ✓',
steps:["Try each cell as starting point","DFS: if current char matches word[idx]","Mark cell visited (change to '#')","Explore 4 directions for next char","Backtrack: restore cell value"],
code:`class Solution {
    public boolean exist(char[][] board, String word) {
        for (int i = 0; i < board.length; i++)
            for (int j = 0; j < board[0].length; j++)
                if (dfs(board, word, i, j, 0)) return true;
        return false;
    }
    boolean dfs(char[][] b, String w, int i, int j, int idx) {
        if (idx == w.length()) return true;
        if (i<0 || j<0 || i>=b.length || j>=b[0].length || b[i][j]!=w.charAt(idx)) return false;
        char tmp = b[i][j];
        b[i][j] = '#';
        boolean found = dfs(b,w,i+1,j,idx+1) || dfs(b,w,i-1,j,idx+1) ||
                        dfs(b,w,i,j+1,idx+1) || dfs(b,w,i,j-1,idx+1);
        b[i][j] = tmp;
        return found;
    }
}`,
timeComplexity:"O(m·n·4^L)",spaceComplexity:"O(L) recursion",
mistakes:["Not restoring cell after backtracking","Using separate visited array (modify in-place is cleaner)","Not short-circuiting on finding the word"],
trick:"🧠 'Mark cell as visited by changing to #. Explore 4 dirs. Restore on backtrack. Grid DFS classic!'"
},
{id:85,topic:"Backtracking",pattern:"Decision Tree / Sequence Generation",title:"Letter Combinations of Phone Number",difficulty:"medium",
intuition:"Map digits to letters. For each digit, try each letter. Recursive tree of choices builds all combinations.",
visual:'"23" → a,b,c × d,e,f\nad, ae, af, bd, be, bf, cd, ce, cf',
steps:["Map: 2→abc, 3→def, etc.","For each digit, iterate its letters","Add letter, recurse on next digit","When all digits processed → add to result","Backtrack: remove last letter"],
code:`class Solution {
    String[] map = {"","","abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"};
    public List<String> letterCombinations(String digits) {
        List<String> res = new ArrayList<>();
        if (digits.isEmpty()) return res;
        backtrack(res, new StringBuilder(), digits, 0);
        return res;
    }
    void backtrack(List<String> res, StringBuilder sb, String digits, int idx) {
        if (idx == digits.length()) { res.add(sb.toString()); return; }
        for (char c : map[digits.charAt(idx) - '0'].toCharArray()) {
            sb.append(c);
            backtrack(res, sb, digits, idx + 1);
            sb.deleteCharAt(sb.length() - 1);
        }
    }
}`,
timeComplexity:"O(4^n)",spaceComplexity:"O(n)",
mistakes:["Hardcoding wrong letter mappings","Not handling empty input","Creating new strings instead of using StringBuilder"],
trick:"🧠 'Phone keypad tree: each digit branches into 3-4 letters. Depth = number of digits. Classic backtracking!'"
},
{id:86,topic:"Backtracking",pattern:"Choice-Based Backtracking",title:"Subsets II (with duplicates)",difficulty:"medium",
intuition:"Sort array. Same as Subsets but skip duplicates at same recursion level. If nums[i]==nums[i-1] and i>start → skip.",
visual:"[1,2,2]\nSort→[1,2,2]\n[],[1],[1,2],[1,2,2],[2],[2,2]\nSkip second 2 at same level to avoid [2] duplicate",
steps:["Sort the array","Backtrack: for each index from start","Skip if nums[i]==nums[i-1] and i>start","Include nums[i], recurse with i+1","Collect current subset at each call"],
code:`class Solution {
    public List<List<Integer>> subsetsWithDup(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        Arrays.sort(nums);
        backtrack(res, new ArrayList<>(), nums, 0);
        return res;
    }
    void backtrack(List<List<Integer>> res, List<Integer> cur, int[] nums, int start) {
        res.add(new ArrayList<>(cur));
        for (int i = start; i < nums.length; i++) {
            if (i > start && nums[i] == nums[i-1]) continue;
            cur.add(nums[i]);
            backtrack(res, cur, nums, i + 1);
            cur.remove(cur.size() - 1);
        }
    }
}`,
timeComplexity:"O(n·2^n)",spaceComplexity:"O(n)",
mistakes:["Not sorting first (can't detect adjacent duplicates)","Using i > 0 instead of i > start (skips valid inclusions)","Using HashSet to dedup (works but inefficient)"],
trick:"🧠 'Sort + skip duplicates at SAME LEVEL (i > start). This is the universal dedup trick for backtracking!'"
}
];
