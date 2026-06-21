// Batch 10: DP Part 2 + Trie + Bit Manipulation (Q97-Q106)
var BATCH10 = [
{id:97,topic:"DP",pattern:"DP on Strings",title:"Edit Distance",difficulty:"hard",
intuition:"dp[i][j] = min ops to convert word1[0..i] to word2[0..j]. If match→diagonal. Else min(insert,delete,replace)+1.",
visual:'"horse" → "ros"\n  _ r o s\n_ 0 1 2 3\nh 1 1 2 3\no 2 2 1 2\nr 3 2 2 2\ns 4 3 3 2\ne 5 4 4 3 → answer=3',
steps:["dp[i][0]=i (delete all), dp[0][j]=j (insert all)","If chars match → dp[i][j] = dp[i-1][j-1]","Else → 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])","Three operations: delete, insert, replace"],
code:`class Solution {
    public int minDistance(String w1, String w2) {
        int m = w1.length(), n = w2.length();
        int[][] dp = new int[m+1][n+1];
        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;
        for (int i = 1; i <= m; i++)
            for (int j = 1; j <= n; j++)
                if (w1.charAt(i-1) == w2.charAt(j-1))
                    dp[i][j] = dp[i-1][j-1];
                else
                    dp[i][j] = 1 + Math.min(dp[i-1][j-1],
                                   Math.min(dp[i-1][j], dp[i][j-1]));
        return dp[m][n];
    }
}`,
timeComplexity:"O(m×n)",spaceComplexity:"O(m×n)",
mistakes:["Not initializing base cases (empty string conversions)","Forgetting the +1 for operations","Confusing which direction is insert vs delete"],
trick:"🧠 'Match→free (diagonal). No match→1 + min(replace↖, delete↑, insert←). Classic DP table!'"
},
{id:98,topic:"DP",pattern:"Knapsack / Subset Sum",title:"0/1 Knapsack",difficulty:"medium",
intuition:"For each item: include (value + dp[w-weight]) or exclude (dp[w]). dp[i][w] = max value with capacity w.",
visual:"items: wt=[1,3,4,5] val=[1,4,5,7] W=7\ndp[4][7] = max(dp[3][7], 7+dp[3][2]) = max(9, 7+1) = 9\nPick items: 3kg(val4) + 4kg(val5) = 9",
steps:["dp[i][w] = max value using items 0..i with capacity w","Exclude: dp[i][w] = dp[i-1][w]","Include: dp[i][w] = val[i] + dp[i-1][w-wt[i]]","Take max of include/exclude","Can optimize to 1D: iterate w backwards"],
code:`class Solution {
    public int knapsack(int[] wt, int[] val, int W) {
        int n = wt.length;
        int[] dp = new int[W + 1];
        for (int i = 0; i < n; i++)
            for (int w = W; w >= wt[i]; w--)
                dp[w] = Math.max(dp[w], val[i] + dp[w - wt[i]]);
        return dp[W];
    }
}`,
timeComplexity:"O(n×W)",spaceComplexity:"O(W)",
mistakes:["Iterating w forward in 1D (allows reusing same item = unbounded)","Not checking if weight fits (w >= wt[i])","Confusing 0/1 (backward) vs unbounded (forward) iteration"],
trick:"🧠 '1D knapsack: iterate weight BACKWARDS for 0/1, FORWARDS for unbounded. Backward prevents item reuse!'"
},
{id:99,topic:"DP",pattern:"DP on Stocks",title:"Best Time to Buy and Sell Stock",difficulty:"easy",
intuition:"Track min price so far. At each day, profit = price - minPrice. Track max profit.",
visual:"[7,1,5,3,6,4]\nminPrice: 7→1→1→1→1→1\nprofit:   0→0→4→2→5→3\nMax profit = 5 (buy at 1, sell at 6)",
steps:["minPrice = prices[0]","For each price","profit = price - minPrice","maxProfit = max(maxProfit, profit)","minPrice = min(minPrice, price)"],
code:`class Solution {
    public int maxProfit(int[] prices) {
        int min = Integer.MAX_VALUE, max = 0;
        for (int p : prices) {
            min = Math.min(min, p);
            max = Math.max(max, p - min);
        }
        return max;
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(1)",
mistakes:["Comparing all pairs O(n²)","Selling before buying (future min after current day)","Not tracking running minimum"],
trick:"🧠 'Track min price seen so far. Today\\'s profit = today - min_so_far. Keep best profit. One pass!'"
},
{id:100,topic:"DP",pattern:"DP on Stocks",title:"Best Time to Buy and Sell Stock with Cooldown",difficulty:"medium",
intuition:"State machine: hold, sold, rest. hold=max(hold, rest-price). sold=hold+price. rest=max(rest, sold).",
visual:"[1,2,3,0,2]\nDay 0: hold=-1, sold=0, rest=0\nDay 1: hold=-1, sold=1, rest=0\nDay 2: hold=-1, sold=2, rest=1\nDay 3: hold=1, sold=-1, rest=2\nDay 4: hold=1, sold=3, rest=2 → max=3",
steps:["Three states: holding, just_sold, resting","hold = max(prev_hold, prev_rest - price)","sold = prev_hold + price","rest = max(prev_rest, prev_sold)","Answer = max(sold, rest) at end"],
code:`class Solution {
    public int maxProfit(int[] prices) {
        int hold = Integer.MIN_VALUE, sold = 0, rest = 0;
        for (int p : prices) {
            int prevSold = sold;
            sold = hold + p;
            hold = Math.max(hold, rest - p);
            rest = Math.max(rest, prevSold);
        }
        return Math.max(sold, rest);
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(1)",
mistakes:["Not separating sold and rest states","Buying immediately after selling (cooldown violation)","Using 2D DP when 3 variables suffice"],
trick:"🧠 'State machine: HOLD, SOLD, REST. Sold→must rest. Rest→can buy. Hold→can sell. Three variables!'"
},
{id:101,topic:"DP",pattern:"DP on Intervals",title:"Burst Balloons",difficulty:"hard",
intuition:"dp[l][r] = max coins from bursting balloons between l and r. Try each balloon k as the LAST to burst in range.",
visual:"[3,1,5,8] → add borders [1,3,1,5,8,1]\nBurst order matters:\nBurst 1: 3*1*5=15, then [3,5,8]\nOptimal: burst 1, then 5, then 3, then 8 → 167",
steps:["Add 1 at both ends (borders)","dp[l][r] = max coins in range (l,r) exclusive","For each k between l and r as LAST burst","coins = nums[l]*nums[k]*nums[r] + dp[l][k] + dp[k][r]","Iterate by increasing window size"],
code:`class Solution {
    public int maxCoins(int[] nums) {
        int n = nums.length;
        int[] arr = new int[n + 2];
        arr[0] = arr[n + 1] = 1;
        for (int i = 0; i < n; i++) arr[i + 1] = nums[i];
        int[][] dp = new int[n + 2][n + 2];
        for (int len = 2; len <= n + 1; len++)
            for (int l = 0; l + len <= n + 1; l++) {
                int r = l + len;
                for (int k = l + 1; k < r; k++)
                    dp[l][r] = Math.max(dp[l][r],
                        arr[l]*arr[k]*arr[r] + dp[l][k] + dp[k][r]);
            }
        return dp[0][n + 1];
    }
}`,
timeComplexity:"O(n³)",spaceComplexity:"O(n²)",
mistakes:["Thinking of k as FIRST to burst (should be LAST)","Not adding border 1s","Wrong range iteration order"],
trick:"🧠 'Think BACKWARDS: which balloon bursts LAST in this range? That balloon sees the borders l and r!'"
},
{id:102,topic:"DP",pattern:"DP on Trees / DAGs",title:"House Robber III (Tree)",difficulty:"medium",
intuition:"At each node: rob it (skip children) or skip it (rob children). Return pair [rob, notRob] from each subtree.",
visual:"    3\n   / \\\n  2   3\n   \\   \\\n    3   1\nRob 3+3+1=7? No!\nRob root(3)+grandchildren(3+1)=7\nOr skip root: 2+3=5+... → max=7",
steps:["DFS returns [robThis, skipThis]","robThis = node.val + left[1] + right[1]","skipThis = max(left) + max(right)","At root, return max of the two"],
code:`class Solution {
    public int rob(TreeNode root) {
        int[] res = dfs(root);
        return Math.max(res[0], res[1]);
    }
    int[] dfs(TreeNode node) {
        if (node == null) return new int[]{0, 0};
        int[] left = dfs(node.left), right = dfs(node.right);
        int rob = node.val + left[1] + right[1];
        int skip = Math.max(left[0], left[1]) + Math.max(right[0], right[1]);
        return new int[]{rob, skip};
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(h)",
mistakes:["Using HashMap memoization (works but pair return is cleaner)","Not considering grandchildren properly","Recalculating subtrees multiple times without memoization"],
trick:"🧠 'Return a PAIR [rob, skip] from each node. Rob = val + children\\'s skip. Skip = max of children\\'s choices.'"
},
{id:103,topic:"Trie",pattern:"Basic Trie Operations",title:"Implement Trie",difficulty:"medium",
intuition:"Tree of characters. Each node has children[26] and isEnd flag. Insert builds path, search follows path.",
visual:'Insert "apple":\nroot→a→p→p→l→e(end)\nSearch "app" → found but isEnd=false → false\nstartsWith "app" → found → true',
steps:["TrieNode: children[26], isEnd boolean","Insert: create nodes along the word, mark end","Search: follow nodes, check isEnd at last char","StartsWith: follow nodes, return true if path exists"],
code:`class Trie {
    class TrieNode {
        TrieNode[] children = new TrieNode[26];
        boolean isEnd;
    }
    TrieNode root = new TrieNode();
    public void insert(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            if (node.children[c-'a'] == null)
                node.children[c-'a'] = new TrieNode();
            node = node.children[c-'a'];
        }
        node.isEnd = true;
    }
    public boolean search(String word) {
        TrieNode node = find(word);
        return node != null && node.isEnd;
    }
    public boolean startsWith(String prefix) {
        return find(prefix) != null;
    }
    TrieNode find(String s) {
        TrieNode node = root;
        for (char c : s.toCharArray()) {
            if (node.children[c-'a'] == null) return null;
            node = node.children[c-'a'];
        }
        return node;
    }
}`,
timeComplexity:"O(L) per operation",spaceComplexity:"O(total chars)",
mistakes:["Not marking isEnd (search can't distinguish prefix from word)","Using HashMap instead of array (slower)","Not sharing common prefixes"],
trick:"🧠 'Trie = prefix tree. Each edge = one character. isEnd marks complete words. O(L) for all operations!'"
},
{id:104,topic:"Trie",pattern:"Word Break / Segmentation",title:"Word Break",difficulty:"medium",
intuition:"dp[i] = can s[0..i] be segmented. For each i, check all j < i: if dp[j] && s[j..i] in dict → dp[i] = true.",
visual:'s="leetcode", dict=["leet","code"]\ndp[0]=T (empty)\ndp[4]=T ("leet" in dict)\ndp[8]=T ("code" in dict, dp[4]=T)\nResult: true',
steps:["dp[0] = true (empty string)","For i from 1 to n","For j from 0 to i","If dp[j] && s[j..i] in wordSet → dp[i] = true","Return dp[n]"],
code:`class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        Set<String> set = new HashSet<>(wordDict);
        boolean[] dp = new boolean[s.length() + 1];
        dp[0] = true;
        for (int i = 1; i <= s.length(); i++)
            for (int j = 0; j < i; j++)
                if (dp[j] && set.contains(s.substring(j, i))) {
                    dp[i] = true;
                    break;
                }
        return dp[s.length()];
    }
}`,
timeComplexity:"O(n²·k)",spaceComplexity:"O(n)",
mistakes:["Not breaking after finding valid segmentation at position i","Using pure recursion without memoization","Not using HashSet for O(1) word lookup"],
trick:"🧠 'dp[i] = any valid split point j where dp[j]=true AND s[j..i] is a word. Break early for speed!'"
},
{id:105,topic:"Bit Manipulation",pattern:"Basic Bit Operations",title:"Single Number",difficulty:"easy",
intuition:"XOR all numbers. Pairs cancel out (a⊕a=0). The single number remains (0⊕a=a).",
visual:"[4,1,2,1,2]\n4⊕1=5, 5⊕2=7, 7⊕1=6, 6⊕2=4\nResult: 4 (the single one!)",
steps:["Initialize result = 0","XOR every number with result","Pairs cancel: a ⊕ a = 0","Single number remains: 0 ⊕ a = a","Return result"],
code:`class Solution {
    public int singleNumber(int[] nums) {
        int res = 0;
        for (int n : nums) res ^= n;
        return res;
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(1)",
mistakes:["Using HashMap (O(n) space, unnecessary)","Using sorting O(n log n)","Not knowing XOR properties: a^a=0, a^0=a, commutative"],
trick:"🧠 'XOR is magic! Pairs vanish, loner survives. a⊕a=0, 0⊕a=a. One line solution!'"
},
{id:106,topic:"Bit Manipulation",pattern:"Subsets / Bitmask",title:"Counting Bits",difficulty:"easy",
intuition:"dp[i] = dp[i>>1] + (i&1). Number of 1s in i = number of 1s in i/2 plus last bit.",
visual:"i: 0  1  2  3  4  5  6  7\nbits: 0  1  1  2  1  2  2  3\ndp[5]=dp[2]+(5&1)=1+1=2 (101 has two 1s)",
steps:["dp[0] = 0","For i from 1 to n","dp[i] = dp[i >> 1] + (i & 1)","i>>1 removes last bit, i&1 checks last bit","Return dp array"],
code:`class Solution {
    public int[] countBits(int n) {
        int[] dp = new int[n + 1];
        for (int i = 1; i <= n; i++)
            dp[i] = dp[i >> 1] + (i & 1);
        return dp;
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(n)",
mistakes:["Counting bits individually for each number O(n log n)","Not seeing the DP relationship with i/2","Confusing >> (right shift) with << (left shift)"],
trick:"🧠 'dp[i] = dp[i/2] + last_bit. Right shift removes a bit you already counted. DP on bits!'"
}
];
