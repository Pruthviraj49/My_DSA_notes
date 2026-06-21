// Batch 1: Arrays - Two Pointer, Sliding Window, Prefix Sum, Kadane's (Q1-Q10)
var BATCH1 = [
{id:1,topic:"Arrays",pattern:"Two Pointer",title:"Two Sum",difficulty:"easy",
intuition:"Use a HashMap to store complement. For each num, check if target-num exists in map. Single pass O(n).",
visual:"arr = [2,7,11,15], target=9\n\nStep 1: map={} → see 2, need 7, store {2:0}\nStep 2: map={2:0} → see 7, need 2, FOUND at idx 0! → return [0,1]",
steps:["Iterate array","Compute complement = target - nums[i]","Check if complement in map","If yes → return indices","Else store nums[i] → i in map"],
code:`class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int comp = target - nums[i];
            if (map.containsKey(comp))
                return new int[]{map.get(comp), i};
            map.put(nums[i], i);
        }
        return new int[]{};
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(n)",
mistakes:["Using nested loops O(n²) instead of HashMap","Forgetting to handle duplicate values","Returning wrong indices (1-indexed vs 0-indexed)"],
trick:"🧠 TWO SUM = One-pass HashMap. 'I COMPLEMENT you!' — for each number, ask: does my other half exist?"
},
{id:2,topic:"Arrays",pattern:"Two Pointer",title:"3Sum",difficulty:"medium",
intuition:"Sort array. Fix one element, use two pointers on remaining to find triplets summing to 0. Skip duplicates.",
visual:"[-1,0,1,2,-1,-4] → sort → [-4,-1,-1,0,1,2]\n\nFix i=1 (-1): L=2(-1), R=5(2)\n  sum=-1+(-1)+2=0 ✓ → add [-1,-1,2]\n  skip dup L, move R\n  L=3(0), R=4(1): sum=0 ✓ → add [-1,0,1]",
steps:["Sort the array","Fix element at i","Two pointers L=i+1, R=end","If sum<0 move L right","If sum>0 move R left","If sum=0, record & skip duplicates"],
code:`class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        Arrays.sort(nums);
        for (int i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] == nums[i-1]) continue;
            int l = i + 1, r = nums.length - 1;
            while (l < r) {
                int sum = nums[i] + nums[l] + nums[r];
                if (sum < 0) l++;
                else if (sum > 0) r--;
                else {
                    res.add(Arrays.asList(nums[i], nums[l], nums[r]));
                    while (l < r && nums[l] == nums[l+1]) l++;
                    while (l < r && nums[r] == nums[r-1]) r--;
                    l++; r--;
                }
            }
        }
        return res;
    }
}`,
timeComplexity:"O(n²)",spaceComplexity:"O(1)",
mistakes:["Not sorting first","Not skipping duplicates → duplicate triplets","Off-by-one in duplicate skipping"],
trick:"🧠 3SUM = Sort + Fix one + Two Pointer squeeze. 'Three's a crowd — pin one, squeeze the other two!'"
},
{id:3,topic:"Arrays",pattern:"Two Pointer",title:"Container With Most Water",difficulty:"medium",
intuition:"Two pointers at ends. Area = min(h[l],h[r])*(r-l). Move the shorter side inward — only way to potentially increase area.",
visual:"h=[1,8,6,2,5,4,8,3,7]\n L=0(1)  R=8(7) → area=1*8=8\n L=1(8)  R=8(7) → area=7*7=49 ★max\n L=1(8)  R=7(3) → area=3*6=18\n ...",
steps:["L=0, R=n-1","Compute area = min(h[L],h[R]) * (R-L)","Update maxArea","Move pointer with smaller height","Repeat until L>=R"],
code:`class Solution {
    public int maxArea(int[] height) {
        int l = 0, r = height.length - 1, max = 0;
        while (l < r) {
            max = Math.max(max, Math.min(height[l], height[r]) * (r - l));
            if (height[l] < height[r]) l++;
            else r--;
        }
        return max;
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(1)",
mistakes:["Moving the taller pointer instead of shorter","Using area = h[l]*h[r] without min()","Not considering width (r-l)"],
trick:"🧠 'Short wall moves!' — the shorter side limits water, so move it hoping for a taller replacement."
},
{id:4,topic:"Arrays",pattern:"Two Pointer",title:"Trapping Rain Water",difficulty:"hard",
intuition:"Water at each index = min(maxLeft, maxRight) - height[i]. Use two pointers with running left/right max to avoid extra space.",
visual:"h=[0,1,0,2,1,0,1,3,2,1,2,1]\n     ___\n _   | |   _\n| |w | | w| |w\n|_|__|_|__|_|__\n water trapped = 6",
steps:["L=0, R=n-1","Track leftMax, rightMax","If leftMax <= rightMax: water += leftMax-h[L], move L","Else: water += rightMax-h[R], move R","Process shorter side first"],
code:`class Solution {
    public int trap(int[] h) {
        int l = 0, r = h.length - 1;
        int lMax = 0, rMax = 0, water = 0;
        while (l < r) {
            if (h[l] <= h[r]) {
                lMax = Math.max(lMax, h[l]);
                water += lMax - h[l];
                l++;
            } else {
                rMax = Math.max(rMax, h[r]);
                water += rMax - h[r];
                r--;
            }
        }
        return water;
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(1)",
mistakes:["Forgetting water can't be negative at edges","Confusing leftMax/rightMax update order","Using prefix arrays when O(1) space is possible"],
trick:"🧠 'Shorter side is safe!' — process the smaller side; its water is guaranteed by the taller other side."
},
{id:5,topic:"Arrays",pattern:"Two Pointer",title:"Sort Colors (Dutch National Flag)",difficulty:"medium",
intuition:"3-way partition: low ptr for 0s, mid scans, high ptr for 2s. Swap 0s to low, 2s to high, 1s stay in middle.",
visual:"[2,0,2,1,1,0]\n l=0,m=0,h=5\n m→2: swap(m,h)→[0,0,2,1,1,2] h=4\n m→0: swap(l,m)→[0,0,2,1,1,2] l=1,m=1\n m→0: swap→[0,0,2,1,1,2] l=2,m=2\n m→2: swap(m,h)→[0,0,1,1,2,2] h=3\n m→1: m++ → m=3\n m→1: m++ → m=4 > h → DONE",
steps:["low=0, mid=0, high=n-1","If arr[mid]==0: swap(low,mid), low++, mid++","If arr[mid]==1: mid++","If arr[mid]==2: swap(mid,high), high--","Continue while mid<=high"],
code:`class Solution {
    public void sortColors(int[] nums) {
        int lo = 0, mid = 0, hi = nums.length - 1;
        while (mid <= hi) {
            if (nums[mid] == 0) {
                swap(nums, lo++, mid++);
            } else if (nums[mid] == 1) {
                mid++;
            } else {
                swap(nums, mid, hi--);
            }
        }
    }
    void swap(int[] a, int i, int j) {
        int t = a[i]; a[i] = a[j]; a[j] = t;
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(1)",
mistakes:["Incrementing mid after swap with high (the swapped value needs checking)","Using counting sort (valid but not in-place single-pass)","Wrong loop condition: mid < hi vs mid <= hi"],
trick:"🧠 'DNF = 0→Low, 1→Mid, 2→High'. Red-White-Blue: 0s left, 2s right, 1s chill in the middle!"
},
{id:6,topic:"Arrays",pattern:"Sliding Window",title:"Maximum Subarray Sum of Size K",difficulty:"easy",
intuition:"Maintain a window of size K. Slide it across: add new element, remove old. Track max sum throughout.",
visual:"arr=[2,1,5,1,3,2], K=3\nWindow [2,1,5]=8 → max=8\nWindow [1,5,1]=7 → max=8\nWindow [5,1,3]=9 → max=9 ★\nWindow [1,3,2]=6 → max=9",
steps:["Compute sum of first K elements","Slide: add arr[i], subtract arr[i-K]","Track maximum sum","Return max"],
code:`class Solution {
    public int maxSumSubarray(int[] arr, int k) {
        int sum = 0, max = 0;
        for (int i = 0; i < k; i++) sum += arr[i];
        max = sum;
        for (int i = k; i < arr.length; i++) {
            sum += arr[i] - arr[i - k];
            max = Math.max(max, sum);
        }
        return max;
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(1)",
mistakes:["Recomputing sum for each window from scratch O(nk)","Off-by-one: removing wrong element","Not initializing max with first window sum"],
trick:"🧠 'Slide & Subtract!' — add the new guest, kick out the old one, keep track of the best party."
},
{id:7,topic:"Arrays",pattern:"Sliding Window",title:"Longest Substring Without Repeating Characters",difficulty:"medium",
intuition:"Expand window right. If char repeats, shrink from left past the previous occurrence. Track max length.",
visual:'s="abcabcbb"\n[a]bcabcbb → len=1\n[ab]cabcbb → len=2\n[abc]abcbb → len=3 ★\na[bca]bcbb → len=3\nab[cab]cbb → len=3\nabc[abc]bb → len=3\nabcab[cb]b → len=2\nabcabc[b]b → len=1',
steps:["Use HashMap<char, last_index>","Expand right pointer","If char in map and index >= left, move left","Update char index in map","Track max(right-left+1)"],
code:`class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> map = new HashMap<>();
        int max = 0, left = 0;
        for (int r = 0; r < s.length(); r++) {
            char c = s.charAt(r);
            if (map.containsKey(c) && map.get(c) >= left)
                left = map.get(c) + 1;
            map.put(c, r);
            max = Math.max(max, r - left + 1);
        }
        return max;
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(min(n,26))",
mistakes:["Not checking if previous index >= left (stale entries)","Using Set and removing all chars till duplicate","Off-by-one in window length calculation"],
trick:"🧠 'Map stores last seen index. If repeat is inside window → jump left past it. EXPAND right, SHRINK left.'"
},
{id:8,topic:"Arrays",pattern:"Sliding Window",title:"Minimum Window Substring",difficulty:"hard",
intuition:"Expand right to include all chars of t. Once valid, shrink from left to minimize. Track shortest valid window.",
visual:'s="ADOBECODEBANC", t="ABC"\nExpand→ [ADOBEC] has A,B,C → len=6\nShrink→ A[DOBEC] missing A\nExpand→ A[DOBECODEBA] → shrink\n→ ADOBECODE[BANC] → len=4 ★',
steps:["Count chars of t in needMap","Expand right, decrease need count","When all matched, try shrink left","Update min window","Continue until end"],
code:`class Solution {
    public String minWindow(String s, String t) {
        int[] need = new int[128];
        for (char c : t.toCharArray()) need[c]++;
        int l = 0, count = t.length(), minLen = Integer.MAX_VALUE, start = 0;
        for (int r = 0; r < s.length(); r++) {
            if (need[s.charAt(r)]-- > 0) count--;
            while (count == 0) {
                if (r - l + 1 < minLen) {
                    minLen = r - l + 1;
                    start = l;
                }
                if (++need[s.charAt(l++)] > 0) count++;
            }
        }
        return minLen == Integer.MAX_VALUE ? "" : s.substring(start, start + minLen);
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(1)",
mistakes:["Not handling when t has duplicate chars","Shrinking too aggressively (breaking valid window)","Returning length instead of actual substring"],
trick:"🧠 'Expand till valid, shrink till invalid.' Like a rubber band — stretch to cover t, squeeze to minimize."
},
{id:9,topic:"Arrays",pattern:"Prefix Sum",title:"Subarray Sum Equals K",difficulty:"medium",
intuition:"prefixSum[j]-prefixSum[i]=k means subarray(i+1..j) sums to k. Store prefix sum frequencies in HashMap.",
visual:"arr=[1,1,1], k=2\nprefix: 0→1→2→3\nAt prefix=2: 2-2=0, map has 0→count 1 ✓\nAt prefix=3: 3-2=1, map has 1→count 1 ✓\nTotal = 2 subarrays",
steps:["Initialize map with {0:1}","Accumulate prefix sum","Check if (sum-k) exists in map","Add its frequency to result","Store current sum in map"],
code:`class Solution {
    public int subarraySum(int[] nums, int k) {
        Map<Integer, Integer> map = new HashMap<>();
        map.put(0, 1);
        int sum = 0, count = 0;
        for (int n : nums) {
            sum += n;
            count += map.getOrDefault(sum - k, 0);
            map.merge(sum, 1, Integer::sum);
        }
        return count;
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(n)",
mistakes:["Forgetting to initialize map with {0:1}","Using sliding window (doesn't work with negatives)","Checking sum==k instead of sum-k in map"],
trick:"🧠 'Prefix Sum + HashMap = Subarray magic!' If current_sum - k was seen before, there's a subarray summing to k."
},
{id:10,topic:"Arrays",pattern:"Kadane's Algorithm",title:"Maximum Subarray (Kadane's)",difficulty:"medium",
intuition:"At each index, decide: extend previous subarray or start fresh. Track running max and global max.",
visual:"[-2,1,-3,4,-1,2,1,-5,4]\ncur: -2→1→-2→4→3→5→6→1→5\nmax: -2→1→ 1→4→4→5→6→6→6 ★=6\nSubarray: [4,-1,2,1]",
steps:["currentMax = nums[0], globalMax = nums[0]","For each element from index 1","currentMax = max(nums[i], currentMax + nums[i])","globalMax = max(globalMax, currentMax)","Return globalMax"],
code:`class Solution {
    public int maxSubArray(int[] nums) {
        int cur = nums[0], max = nums[0];
        for (int i = 1; i < nums.length; i++) {
            cur = Math.max(nums[i], cur + nums[i]);
            max = Math.max(max, cur);
        }
        return max;
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(1)",
mistakes:["Initializing max to 0 (fails with all-negative arrays)","Not considering single-element subarrays","Resetting cur to 0 instead of nums[i]"],
trick:"🧠 'Extend or restart?' — Kadane asks each element: 'Am I better alone or with the group?' max(me, me+group)."
}
];
