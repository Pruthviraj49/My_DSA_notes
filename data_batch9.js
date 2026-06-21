// Batch 9: Greedy + DP Part 1 (Q87-Q96)
var BATCH9 = [
{id:87,topic:"Greedy",pattern:"Intervals & Reach",title:"Jump Game",difficulty:"medium",
intuition:"Track farthest reachable index. At each position, update maxReach. If i > maxReach → unreachable.",
visual:"[2,3,1,1,4]\nmaxReach: 2→4→4→4→8 → reached end ✓\n\n[3,2,1,0,4]\nmaxReach: 3→3→3→3 → stuck at 3, can't reach 4 ✗",
steps:["maxReach = 0","For each index i","If i > maxReach → return false","maxReach = max(maxReach, i + nums[i])","If maxReach >= n-1 → return true"],
code:`class Solution {
    public boolean canJump(int[] nums) {
        int maxReach = 0;
        for (int i = 0; i < nums.length; i++) {
            if (i > maxReach) return false;
            maxReach = Math.max(maxReach, i + nums[i]);
        }
        return true;
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(1)",
mistakes:["Using BFS/DFS → too slow","Not checking if current index is reachable","Overcomplicating with DP when greedy suffices"],
trick:"🧠 'Greedy reach: can I reach index i? Is i ≤ maxReach? If yes, extend reach. If no, stuck forever.'"
},
{id:88,topic:"Greedy",pattern:"Intervals & Reach",title:"Merge Intervals",difficulty:"medium",
intuition:"Sort by start. Merge overlapping intervals: if current start ≤ prev end, extend prev end. Else new interval.",
visual:"[[1,3],[2,6],[8,10],[15,18]]\nSort (already sorted)\n[1,3]+[2,6] → overlap → [1,6]\n[1,6]+[8,10] → no overlap → new\nResult: [[1,6],[8,10],[15,18]]",
steps:["Sort intervals by start time","Initialize result with first interval","For each subsequent interval","If start ≤ last result's end → merge (extend end)","Else add as new interval"],
code:`class Solution {
    public int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, (a,b) -> a[0] - b[0]);
        List<int[]> res = new ArrayList<>();
        res.add(intervals[0]);
        for (int i = 1; i < intervals.length; i++) {
            int[] last = res.get(res.size() - 1);
            if (intervals[i][0] <= last[1])
                last[1] = Math.max(last[1], intervals[i][1]);
            else
                res.add(intervals[i]);
        }
        return res.toArray(new int[0][]);
    }
}`,
timeComplexity:"O(n log n)",spaceComplexity:"O(n)",
mistakes:["Not sorting first","Using = instead of <= for overlap check","Not taking max of ends when merging"],
trick:"🧠 'Sort by start → scan left to right. Overlap? Extend end. No overlap? New interval. Simple merge!'"
},
{id:89,topic:"Greedy",pattern:"Intervals & Reach",title:"Non-Overlapping Intervals (Min Removals)",difficulty:"medium",
intuition:"Sort by end time. Greedily keep intervals that end earliest. Count overlaps that must be removed.",
visual:"[[1,2],[2,3],[3,4],[1,3]]\nSort by end: [1,2],[2,3],[1,3],[3,4]\nKeep [1,2], keep [2,3], skip [1,3](overlap), keep [3,4]\nRemove 1 interval",
steps:["Sort by end time","Track last kept interval's end","If current start >= lastEnd → keep it","Else → must remove (increment count)","Return removal count"],
code:`class Solution {
    public int eraseOverlapIntervals(int[][] intervals) {
        Arrays.sort(intervals, (a,b) -> a[1] - b[1]);
        int count = 0, end = Integer.MIN_VALUE;
        for (int[] i : intervals) {
            if (i[0] >= end) end = i[1];
            else count++;
        }
        return count;
    }
}`,
timeComplexity:"O(n log n)",spaceComplexity:"O(1)",
mistakes:["Sorting by start instead of end","Using > instead of >= (touching is not overlapping)","Counting intervals to KEEP instead of REMOVE"],
trick:"🧠 'Activity selection: sort by END time, greedily pick earliest finishing. Count the ones you skip!'"
},
{id:90,topic:"Greedy",pattern:"Sorting / Local Choice",title:"Assign Cookies",difficulty:"easy",
intuition:"Sort children's greed and cookie sizes. Match smallest cookie to least greedy child. Two-pointer scan.",
visual:"children=[1,2,3], cookies=[1,1]\nSort both → children=[1,2,3], cookies=[1,1]\ncookie 1 ≥ child 1 ✓ → match!\ncookie 1 < child 2 ✗ → skip\nContent children = 1",
steps:["Sort both arrays","Two pointers: i (child), j (cookie)","If cookie[j] >= child[i] → satisfy child, move both","Else → cookie too small, try next cookie","Count satisfied children"],
code:`class Solution {
    public int findContentChildren(int[] g, int[] s) {
        Arrays.sort(g); Arrays.sort(s);
        int i = 0, j = 0;
        while (i < g.length && j < s.length) {
            if (s[j] >= g[i]) i++;
            j++;
        }
        return i;
    }
}`,
timeComplexity:"O(n log n)",spaceComplexity:"O(1)",
mistakes:["Not sorting both arrays","Wasting large cookies on small greed factors","Moving child pointer when cookie doesn't satisfy"],
trick:"🧠 'Sort both! Smallest cookie for least greedy child. Don\\'t waste big cookies on small appetites.'"
},
{id:91,topic:"DP",pattern:"1D / Linear DP",title:"Climbing Stairs",difficulty:"easy",
intuition:"dp[i] = dp[i-1] + dp[i-2]. From step i, you could have come from i-1 or i-2. It is Fibonacci!",
visual:"n=5\nSteps: 1→1, 2→2, 3→3, 4→5, 5→8\ndp[5] = dp[4] + dp[3] = 5 + 3 = 8 ways",
steps:["dp[1] = 1, dp[2] = 2","For i from 3 to n","dp[i] = dp[i-1] + dp[i-2]","Optimize: use two variables instead of array","Return dp[n]"],
code:`class Solution {
    public int climbStairs(int n) {
        if (n <= 2) return n;
        int a = 1, b = 2;
        for (int i = 3; i <= n; i++) {
            int c = a + b;
            a = b;
            b = c;
        }
        return b;
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(1)",
mistakes:["Not recognizing this as Fibonacci","Using recursion without memoization → O(2^n)","Off-by-one: dp[0]=1 or dp[1]=1 confusion"],
trick:"🧠 'It IS Fibonacci! dp[i] = dp[i-1] + dp[i-2]. Two variables, no array needed. Dead simple.'"
},
{id:92,topic:"DP",pattern:"1D / Linear DP",title:"House Robber",difficulty:"medium",
intuition:"At each house: rob it (add to i-2 total) or skip it (keep i-1 total). dp[i] = max(dp[i-1], dp[i-2]+nums[i]).",
visual:"[2,7,9,3,1]\ndp[0]=2, dp[1]=7\ndp[2]=max(7, 2+9)=11\ndp[3]=max(11, 7+3)=11\ndp[4]=max(11, 11+1)=12\nRob houses 0,2,4 → 2+9+1=12",
steps:["dp[0] = nums[0]","dp[1] = max(nums[0], nums[1])","For i from 2: dp[i] = max(dp[i-1], dp[i-2]+nums[i])","Optimize with two variables","Return dp[n-1]"],
code:`class Solution {
    public int rob(int[] nums) {
        if (nums.length == 1) return nums[0];
        int prev2 = nums[0], prev1 = Math.max(nums[0], nums[1]);
        for (int i = 2; i < nums.length; i++) {
            int cur = Math.max(prev1, prev2 + nums[i]);
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(1)",
mistakes:["Not considering skipping multiple houses","Using dp[i-2]+nums[i] without max(dp[i-1])","Edge case: single house or two houses"],
trick:"🧠 'Rob or skip? dp[i] = max(skip=dp[i-1], rob=dp[i-2]+me). Classic include/exclude DP!'"
},
{id:93,topic:"DP",pattern:"1D / Linear DP",title:"Coin Change",difficulty:"medium",
intuition:"dp[amount] = min coins to make amount. For each coin, dp[i] = min(dp[i], dp[i-coin]+1).",
visual:"coins=[1,3,4], amount=6\ndp: [0,1,2,1,1,2,2]\ndp[6] = min(dp[5]+1, dp[3]+1, dp[2]+1) = min(3,2,3) = 2\nUse coins 3+3 = 6",
steps:["dp array of size amount+1, fill with MAX","dp[0] = 0 (base case)","For each amount from 1 to target","For each coin: if coin <= i, dp[i] = min(dp[i], dp[i-coin]+1)","Return dp[amount] or -1 if MAX"],
code:`class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++)
            for (int c : coins)
                if (c <= i) dp[i] = Math.min(dp[i], dp[i-c] + 1);
        return dp[amount] > amount ? -1 : dp[amount];
    }
}`,
timeComplexity:"O(amount × coins)",spaceComplexity:"O(amount)",
mistakes:["Using greedy (largest coin first) → doesn't always work","Initializing dp with Integer.MAX_VALUE (overflow on +1)","Not checking if coin <= current amount"],
trick:"🧠 'dp[i] = min coins for amount i. Try each coin: dp[i] = min(dp[i-coin] + 1). Bottom-up fill!'"
},
{id:94,topic:"DP",pattern:"1D / Linear DP",title:"Longest Increasing Subsequence",difficulty:"medium",
intuition:"dp[i] = LIS ending at i. For each j < i, if nums[j] < nums[i], dp[i] = max(dp[i], dp[j]+1). O(n²) or binary search O(n log n).",
visual:"[10,9,2,5,3,7,101,18]\nLIS: 2→5→7→101 or 2→3→7→18 → length 4",
steps:["Patience sorting: maintain tails array","For each element, binary search in tails","If larger than all → append","Else replace first element >= current","Length of tails = LIS length"],
code:`class Solution {
    public int lengthOfLIS(int[] nums) {
        List<Integer> tails = new ArrayList<>();
        for (int n : nums) {
            int pos = Collections.binarySearch(tails, n);
            if (pos < 0) pos = -(pos + 1);
            if (pos == tails.size()) tails.add(n);
            else tails.set(pos, n);
        }
        return tails.size();
    }
}`,
timeComplexity:"O(n log n)",spaceComplexity:"O(n)",
mistakes:["O(n²) DP when O(n log n) exists","tails array doesn't store actual LIS sequence","Not handling equal elements correctly in binary search"],
trick:"🧠 'Patience sorting! Maintain smallest possible tails. Binary search for position. Tails length = LIS length.'"
},
{id:95,topic:"DP",pattern:"2D / Grid DP",title:"Unique Paths",difficulty:"medium",
intuition:"dp[i][j] = dp[i-1][j] + dp[i][j-1]. Can only come from top or left. First row/col = 1.",
visual:"3×3 grid:\n1  1  1\n1  2  3\n1  3  6  → 6 unique paths",
steps:["Initialize first row and column to 1","For each cell (i,j)","dp[i][j] = dp[i-1][j] + dp[i][j-1]","Can optimize to 1D array","Return dp[m-1][n-1]"],
code:`class Solution {
    public int uniquePaths(int m, int n) {
        int[] dp = new int[n];
        Arrays.fill(dp, 1);
        for (int i = 1; i < m; i++)
            for (int j = 1; j < n; j++)
                dp[j] += dp[j-1];
        return dp[n-1];
    }
}`,
timeComplexity:"O(m×n)",spaceComplexity:"O(n)",
mistakes:["Not initializing borders to 1","Using 2D array when 1D suffices","Forgetting 0-indexing vs 1-indexing"],
trick:"🧠 'Each cell = sum of top + left. First row and column are all 1s. Space-optimize to single row!'"
},
{id:96,topic:"DP",pattern:"DP on Strings",title:"Longest Common Subsequence",difficulty:"medium",
intuition:"dp[i][j] = LCS of text1[0..i] and text2[0..j]. If chars match → 1+dp[i-1][j-1]. Else max(dp[i-1][j], dp[i][j-1]).",
visual:'"abcde" vs "ace"\n  _ a c e\n_ 0 0 0 0\na 0 1 1 1\nb 0 1 1 1\nc 0 1 2 2\nd 0 1 2 2\ne 0 1 2 3  → LCS = 3 ("ace")',
steps:["Create (m+1)×(n+1) dp table","If text1[i]==text2[j] → dp[i][j] = 1 + dp[i-1][j-1]","Else → dp[i][j] = max(dp[i-1][j], dp[i][j-1])","Return dp[m][n]"],
code:`class Solution {
    public int longestCommonSubsequence(String t1, String t2) {
        int m = t1.length(), n = t2.length();
        int[][] dp = new int[m+1][n+1];
        for (int i = 1; i <= m; i++)
            for (int j = 1; j <= n; j++)
                if (t1.charAt(i-1) == t2.charAt(j-1))
                    dp[i][j] = 1 + dp[i-1][j-1];
                else
                    dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
        return dp[m][n];
    }
}`,
timeComplexity:"O(m×n)",spaceComplexity:"O(m×n)",
mistakes:["Off-by-one: dp indices are 1-based, string indices 0-based","Not initializing first row/col to 0 (default in Java)","Confusing LCS with longest common substring"],
trick:"🧠 'Match → diagonal + 1. No match → max of top or left. Classic 2D string DP. Visualize the table!'"
}
];
