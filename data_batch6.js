// Batch 6: DLL + HashMap + Trees (Q53-Q64)
var BATCH6 = [
{id:53,topic:"Doubly LinkedList",pattern:"Basic DLL Operations",title:"LRU Cache",difficulty:"hard",
intuition:"HashMap for O(1) lookup + Doubly Linked List for O(1) insert/remove. Most recent at head, evict from tail.",
visual:"cap=2: put(1,1)→{1} put(2,2)→{1,2}\nget(1)→move 1 to front→{2,1}\nput(3,3)→evict tail(2)→{1,3}",
steps:["HashMap<key, DLL Node>","get: move node to head, return value","put: if exists→update & move to head","If new & full → remove tail node, delete from map","Add new node at head"],
code:`class LRUCache {
    class Node { int key, val; Node prev, next;
        Node(int k, int v) { key=k; val=v; }
    }
    Map<Integer,Node> map = new HashMap<>();
    Node head = new Node(0,0), tail = new Node(0,0);
    int cap;
    public LRUCache(int capacity) {
        cap = capacity; head.next = tail; tail.prev = head;
    }
    public int get(int key) {
        if (!map.containsKey(key)) return -1;
        Node n = map.get(key); remove(n); addFront(n);
        return n.val;
    }
    public void put(int key, int value) {
        if (map.containsKey(key)) remove(map.get(key));
        if (map.size() == cap) { map.remove(tail.prev.key); remove(tail.prev); }
        Node n = new Node(key, value); addFront(n); map.put(key, n);
    }
    void remove(Node n) { n.prev.next=n.next; n.next.prev=n.prev; }
    void addFront(Node n) { n.next=head.next; n.prev=head; head.next.prev=n; head.next=n; }
}`,
timeComplexity:"O(1) all ops",spaceComplexity:"O(capacity)",
mistakes:["Not removing from map when evicting","Forgetting sentinel head/tail nodes","Not updating node value on put() of existing key"],
trick:"🧠 'HashMap + DLL = O(1) everything! Head = most recent, tail = least recent. Evict tail on overflow.'"
},
{id:54,topic:"Doubly LinkedList",pattern:"Merge / Sort / Reorder",title:"Flatten a Multilevel DLL",difficulty:"medium",
intuition:"When child found, save next. Connect child as next. Traverse to child's end. Connect end to saved next.",
visual:"1⇄2⇄3⇄4  child at 2:\n      ↓\n      5⇄6\nFlatten: 1⇄2⇄5⇄6⇄3⇄4",
steps:["Traverse list","If node has child","Save node.next as nextNode","node.next = child, child.prev = node","Find tail of child list","tail.next = nextNode, clear child pointer"],
code:`class Solution {
    public Node flatten(Node head) {
        Node curr = head;
        while (curr != null) {
            if (curr.child != null) {
                Node next = curr.next;
                Node child = curr.child;
                curr.next = child; child.prev = curr;
                curr.child = null;
                Node tail = child;
                while (tail.next != null) tail = tail.next;
                tail.next = next;
                if (next != null) next.prev = tail;
            }
            curr = curr.next;
        }
        return head;
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(1)",
mistakes:["Not clearing child pointer after flattening","Forgetting to set prev pointers","Not handling nested children (the while loop handles it naturally)"],
trick:"🧠 'Splice the child list inline! Save next → insert child chain → connect tail to saved next. Repeat.'"
},
{id:55,topic:"HashMap",pattern:"Frequency Map / Counting",title:"Top K Frequent Elements",difficulty:"medium",
intuition:"Count frequencies with HashMap. Use bucket sort: index = frequency, bucket[i] = elements with that frequency.",
visual:"[1,1,1,2,2,3], k=2\nFreq: {1:3, 2:2, 3:1}\nBuckets: [_][3][2][1][_][_][_]\nPick from highest bucket: [1,2]",
steps:["Count frequencies in HashMap","Create bucket array of size n+1","Place elements in bucket[frequency]","Iterate buckets from high to low","Collect until k elements found"],
code:`class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int n : nums) freq.merge(n, 1, Integer::sum);
        List<Integer>[] bucket = new List[nums.length + 1];
        for (var e : freq.entrySet()) {
            int f = e.getValue();
            if (bucket[f] == null) bucket[f] = new ArrayList<>();
            bucket[f].add(e.getKey());
        }
        int[] res = new int[k];
        int idx = 0;
        for (int i = bucket.length - 1; i >= 0 && idx < k; i--)
            if (bucket[i] != null)
                for (int n : bucket[i]) { res[idx++] = n; if (idx == k) break; }
        return res;
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(n)",
mistakes:["Using sorting O(n log n) when bucket sort gives O(n)","Bucket size should be n+1 (max freq = n)","Using min-heap O(n log k) — valid but bucket sort is better"],
trick:"🧠 'Bucket sort by frequency! Index IS the frequency. Walk backwards for top-k. O(n) beats heap O(n log k).'"
},
{id:56,topic:"HashMap",pattern:"Prefix-Sum with Map",title:"Contiguous Array (Equal 0s and 1s)",difficulty:"medium",
intuition:"Treat 0 as -1. Prefix sum. If same prefix sum at two indices → subarray between has equal 0s and 1s.",
visual:"[0,1,0,0,1,1,0]\nConvert: [-1,1,-1,-1,1,1,-1]\nPrefix: 0,-1,0,-1,-2,-1,0,-1\nprefix[0]==prefix[2]==prefix[6]=0\nLongest: index 0 to 6, len=6",
steps:["Replace 0 with -1","Compute running prefix sum","HashMap stores first occurrence of each sum","If sum seen before → length = i - map.get(sum)","Track maximum length"],
code:`class Solution {
    public int findMaxLength(int[] nums) {
        Map<Integer, Integer> map = new HashMap<>();
        map.put(0, -1);
        int sum = 0, max = 0;
        for (int i = 0; i < nums.length; i++) {
            sum += nums[i] == 0 ? -1 : 1;
            if (map.containsKey(sum))
                max = Math.max(max, i - map.get(sum));
            else map.put(sum, i);
        }
        return max;
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(n)",
mistakes:["Not initializing map with {0:-1}","Updating map entry (should keep FIRST occurrence for max length)","Forgetting to convert 0→-1 transformation"],
trick:"🧠 'Convert 0→-1, then it is subarray sum = 0 problem! Same prefix sum at two points = balanced subarray.'"
},
{id:57,topic:"HashMap",pattern:"Sliding Window + HashMap",title:"Longest Substring with At Most K Distinct",difficulty:"medium",
intuition:"Sliding window with char count map. Expand right. When distinct > k, shrink left until ≤ k.",
visual:'"eceba", k=2\n[e]→1 [ec]→2 [ece]→2 [eceb]→3>k\nShrink: [ceb]→3 [eb]→2 → max so far\n[eba]→3 [ba]→2\nMax length = 3 "ece"',
steps:["HashMap tracks char counts in window","Expand right: add char","If map.size() > k: shrink left","Remove chars from map when count reaches 0","Track max window size"],
code:`class Solution {
    public int lengthOfLongestSubstringKDistinct(String s, int k) {
        Map<Character, Integer> map = new HashMap<>();
        int l = 0, max = 0;
        for (int r = 0; r < s.length(); r++) {
            map.merge(s.charAt(r), 1, Integer::sum);
            while (map.size() > k) {
                char c = s.charAt(l++);
                map.merge(c, -1, Integer::sum);
                if (map.get(c) == 0) map.remove(c);
            }
            max = Math.max(max, r - l + 1);
        }
        return max;
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(k)",
mistakes:["Not removing key when count reaches 0","Using map.size() > k+1 instead of > k","Shrinking by 1 instead of using while loop"],
trick:"🧠 'Window + HashMap of counts. map.size() = distinct chars. Too many? Shrink from left until k or fewer.'"
},
{id:58,topic:"Trees",pattern:"DFS Traversals",title:"Maximum Depth of Binary Tree",difficulty:"easy",
intuition:"DFS: depth = 1 + max(depth(left), depth(right)). Base case: null node → depth 0.",
visual:"    3\n   / \\\n  9  20\n    /  \\\n   15   7\nLeft depth: 1, Right depth: 2\nMax depth = 1 + 2 = 3",
steps:["If root == null → return 0","Recursively find left depth","Recursively find right depth","Return 1 + max(left, right)"],
code:`class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(h) recursion",
mistakes:["Returning 1 for null node instead of 0","Not adding 1 for current node","Confusing depth vs height (same for max)"],
trick:"🧠 'Depth = 1 + max(left, right). The simplest tree recursion! Every node adds 1 to the deeper child.'"
},
{id:59,topic:"Trees",pattern:"DFS Traversals",title:"Invert Binary Tree",difficulty:"easy",
intuition:"Swap left and right children at every node. Recurse on both subtrees. Pre-order or post-order both work.",
visual:"    4          4\n   / \\   →   / \\\n  2   7     7   2\n / \\ / \\   / \\ / \\\n1  3 6  9 9  6 3  1",
steps:["If root == null → return null","Swap root.left and root.right","Recursively invert left subtree","Recursively invert right subtree","Return root"],
code:`class Solution {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) return null;
        TreeNode temp = root.left;
        root.left = root.right;
        root.right = temp;
        invertTree(root.left);
        invertTree(root.right);
        return root;
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(h) recursion",
mistakes:["Swapping after recursive calls on original children (wrong subtrees)","Only swapping at one level","Not returning root"],
trick:"🧠 'Mirror mirror: swap kids, then recurse. Every node just swaps its two children. That is it!'"
},
{id:60,topic:"Trees",pattern:"DFS Traversals",title:"Diameter of Binary Tree",difficulty:"easy",
intuition:"Diameter through a node = leftHeight + rightHeight. Track max diameter across all nodes during DFS.",
visual:"    1\n   / \\\n  2   3\n / \\\n4   5\nAt node 2: leftH=1, rightH=1 → dia=2\nAt node 1: leftH=2, rightH=1 → dia=3 ★",
steps:["DFS returns height of subtree","At each node: diameter = leftH + rightH","Update global max diameter","Return 1 + max(leftH, rightH) as height"],
code:`class Solution {
    int maxDia = 0;
    public int diameterOfBinaryTree(TreeNode root) {
        height(root);
        return maxDia;
    }
    int height(TreeNode node) {
        if (node == null) return 0;
        int l = height(node.left), r = height(node.right);
        maxDia = Math.max(maxDia, l + r);
        return 1 + Math.max(l, r);
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(h) recursion",
mistakes:["Confusing diameter (edges) with nodes on path","Only checking diameter through root","Not using global variable (returning both height and diameter is messy)"],
trick:"🧠 'Diameter = left height + right height at any node. Height function with a side-effect: update max diameter!'"
},
{id:61,topic:"Trees",pattern:"DFS Traversals",title:"Balanced Binary Tree",difficulty:"easy",
intuition:"A tree is balanced if |leftHeight - rightHeight| ≤ 1 at EVERY node. DFS returning -1 for unbalanced.",
visual:"    1\n   / \\\n  2   3\n / \\\n4   5\n/\n6  → left subtree height=3, right=1 → unbalanced!",
steps:["DFS returns height if balanced, -1 if not","If left or right returns -1 → unbalanced","If |leftH - rightH| > 1 → return -1","Else return 1 + max(leftH, rightH)"],
code:`class Solution {
    public boolean isBalanced(TreeNode root) {
        return checkHeight(root) != -1;
    }
    int checkHeight(TreeNode node) {
        if (node == null) return 0;
        int l = checkHeight(node.left);
        if (l == -1) return -1;
        int r = checkHeight(node.right);
        if (r == -1) return -1;
        if (Math.abs(l - r) > 1) return -1;
        return 1 + Math.max(l, r);
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(h)",
mistakes:["Checking only root's balance (must check ALL nodes)","Computing height separately → O(n²)","Not short-circuiting when subtree already unbalanced"],
trick:"🧠 'Return -1 as poison value = unbalanced! Propagates up instantly. Single O(n) pass, not O(n²).'"
},
{id:62,topic:"Trees",pattern:"BFS / Level-Order",title:"Binary Tree Level Order Traversal",difficulty:"medium",
intuition:"BFS with queue. Process all nodes at current level, collect their values, add children for next level.",
visual:"    3\n   / \\\n  9  20\n    /  \\\n   15   7\nLevel 0: [3]\nLevel 1: [9,20]\nLevel 2: [15,7]",
steps:["Queue with root","While queue not empty","levelSize = queue.size()","Process levelSize nodes","Add children to queue, collect values"],
code:`class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) return res;
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        while (!q.isEmpty()) {
            int size = q.size();
            List<Integer> level = new ArrayList<>();
            for (int i = 0; i < size; i++) {
                TreeNode node = q.poll();
                level.add(node.val);
                if (node.left != null) q.offer(node.left);
                if (node.right != null) q.offer(node.right);
            }
            res.add(level);
        }
        return res;
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(n)",
mistakes:["Not capturing queue size BEFORE processing (size changes during loop)","Using DFS with level tracking (works but BFS is natural)","Forgetting null check on root"],
trick:"🧠 'Capture queue SIZE at start of each level! Process exactly that many nodes = one complete level.'"
},
{id:63,topic:"Trees",pattern:"Lowest Common Ancestor",title:"LCA of Binary Tree",difficulty:"medium",
intuition:"DFS: if current node is p or q, return it. If left and right both return non-null, current node is LCA.",
visual:"    3\n   / \\\n  5   1\n / \\ / \\\n6  2 0  8\nLCA(5,1) = 3 (found in different subtrees)\nLCA(5,4) = 5 (5 is ancestor of 4)",
steps:["If root is null, p, or q → return root","Recurse on left and right","If both non-null → root is LCA","If one is null → return the other","This propagates the answer upward"],
code:`class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root == p || root == q) return root;
        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);
        if (left != null && right != null) return root;
        return left != null ? left : right;
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(h)",
mistakes:["Not handling when p or q IS the root","Searching for both p and q separately (two passes)","Returning wrong node when both are in same subtree"],
trick:"🧠 'Post-order DFS. Both sides found something? YOU are the LCA! Only one side? Pass it up.'"
},
{id:64,topic:"Trees",pattern:"Serialization / Construction",title:"Construct Binary Tree from Preorder and Inorder",difficulty:"medium",
intuition:"Preorder first = root. Find root in inorder → left part is left subtree, right part is right subtree. Recurse.",
visual:"preorder=[3,9,20,15,7] inorder=[9,3,15,20,7]\nRoot=3, inorder split: [9]|3|[15,20,7]\nLeft subtree: pre=[9], in=[9] → node 9\nRight subtree: pre=[20,15,7], in=[15,20,7] → node 20",
steps:["Map inorder values to indices","preorder[0] = root","Find root in inorder → split left/right","Recursively build left subtree","Recursively build right subtree"],
code:`class Solution {
    int preIdx = 0;
    Map<Integer, Integer> inMap = new HashMap<>();
    public TreeNode buildTree(int[] preorder, int[] inorder) {
        for (int i = 0; i < inorder.length; i++) inMap.put(inorder[i], i);
        return build(preorder, 0, inorder.length - 1);
    }
    TreeNode build(int[] pre, int inL, int inR) {
        if (inL > inR) return null;
        int rootVal = pre[preIdx++];
        TreeNode root = new TreeNode(rootVal);
        int inIdx = inMap.get(rootVal);
        root.left = build(pre, inL, inIdx - 1);
        root.right = build(pre, inIdx + 1, inR);
        return root;
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(n)",
mistakes:["Building right subtree before left (preorder index gets wrong)","Linear search in inorder instead of HashMap","Wrong boundary calculation for subtree ranges"],
trick:"🧠 'Preorder gives ROOT, inorder gives SPLIT. Root from pre, partition from in, recurse on both halves.'"
}
];
