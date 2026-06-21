// Combined DSA Data - 106 Questions
// Load all batches and merge
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

// Batch 2: Strings (Q11-Q20)
var BATCH2 = [
{id:11,topic:"Strings",pattern:"Two Pointer (Palindrome)",title:"Valid Palindrome",difficulty:"easy",
intuition:"Two pointers from both ends. Skip non-alphanumeric. Compare lowercase chars moving inward.",
visual:'"A man, a plan, a canal: Panama"\nClean: "amanaplanacanalpanama"\n L→                    ←R\n a==a ✓ → m==m ✓ → a==a ✓ → ... all match!',
steps:["L=0, R=end","Skip non-alphanumeric chars","Compare lowercase chars","If mismatch → false","If L>=R → true"],
code:`class Solution {
    public boolean isPalindrome(String s) {
        int l = 0, r = s.length() - 1;
        while (l < r) {
            while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;
            while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;
            if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r)))
                return false;
            l++; r--;
        }
        return true;
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(1)",
mistakes:["Creating new cleaned string (wastes space)","Forgetting to handle digits as valid chars","Not converting to same case before comparing"],
trick:"🧠 'Squeeze inward, skip junk, compare lowercase.' Two bouncers checking IDs from both doors."
},
{id:12,topic:"Strings",pattern:"Two Pointer (Palindrome)",title:"Longest Palindromic Substring",difficulty:"medium",
intuition:"Expand around center for each position. Try both odd (single center) and even (double center) palindromes.",
visual:'"babad"\nCenter b: b → expand fail\nCenter a: a → bab ✓ → expand fail → len=3\nCenter b: b → aba → expand fail → len=3\nCenter a: a → expand fail\nResult: "bab" or "aba"',
steps:["For each index i, expand around center","Try odd: expand(i,i)","Try even: expand(i,i+1)","While chars match, expand outward","Track longest palindrome found"],
code:`class Solution {
    int start = 0, maxLen = 0;
    public String longestPalindrome(String s) {
        for (int i = 0; i < s.length(); i++) {
            expand(s, i, i);
            expand(s, i, i + 1);
        }
        return s.substring(start, start + maxLen);
    }
    void expand(String s, int l, int r) {
        while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {
            l--; r++;
        }
        if (r - l - 1 > maxLen) {
            start = l + 1;
            maxLen = r - l - 1;
        }
    }
}`,
timeComplexity:"O(n²)",spaceComplexity:"O(1)",
mistakes:["Only checking odd-length palindromes","Off-by-one in substring extraction after expansion","Using DP when expand-around-center is simpler"],
trick:"🧠 'Every palindrome has a CENTER. Stand on each char, stretch both arms equally. Try solo & pair centers.'"
},
{id:13,topic:"Strings",pattern:"Two Pointer (Palindrome)",title:"Valid Palindrome II (Delete at most one char)",difficulty:"easy",
intuition:"Two pointers inward. On mismatch, try skipping left OR skipping right. Check if either gives palindrome.",
visual:'"abca"\n L=0(a) R=3(a) ✓\n L=1(b) R=2(c) ✗ → try skip L: "ca"✗ OR skip R: "bc"... \n Actually: skip L→check "c" vs "c" ✓ → TRUE',
steps:["L=0, R=end, move inward","On mismatch at (L,R)","Check isPalin(L+1, R) OR isPalin(L, R-1)","If either true → return true","If no mismatch → already palindrome"],
code:`class Solution {
    public boolean validPalindrome(String s) {
        int l = 0, r = s.length() - 1;
        while (l < r) {
            if (s.charAt(l) != s.charAt(r))
                return isPalin(s, l+1, r) || isPalin(s, l, r-1);
            l++; r--;
        }
        return true;
    }
    boolean isPalin(String s, int l, int r) {
        while (l < r) {
            if (s.charAt(l++) != s.charAt(r--)) return false;
        }
        return true;
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(1)",
mistakes:["Trying all possible deletions O(n²)","Only trying skip-left without skip-right","Deleting from middle instead of at mismatch point"],
trick:"🧠 'Mismatch? Fork it! Try removing left char OR right char. Only ONE chance to forgive.'"
},
{id:14,topic:"Strings",pattern:"Sliding Window (String)",title:"Longest Repeating Character Replacement",difficulty:"medium",
intuition:"Window where (window_size - max_freq_char) <= k is valid. Expand right, shrink left if invalid.",
visual:'"AABABBA", k=1\nWindow [AABA]: maxFreq(A)=3, size=4, changes=1 ≤ k ✓\nWindow [AABAB]: maxFreq(A)=3, size=5, changes=2 > k ✗ → shrink\nMax valid window = 4',
steps:["Expand window right","Track char frequencies","maxFreq = max frequency in window","If windowSize - maxFreq > k → shrink left","Track max window size"],
code:`class Solution {
    public int characterReplacement(String s, int k) {
        int[] count = new int[26];
        int l = 0, maxFreq = 0, res = 0;
        for (int r = 0; r < s.length(); r++) {
            count[s.charAt(r) - 'A']++;
            maxFreq = Math.max(maxFreq, count[s.charAt(r) - 'A']);
            if (r - l + 1 - maxFreq > k) {
                count[s.charAt(l) - 'A']--;
                l++;
            }
            res = Math.max(res, r - l + 1);
        }
        return res;
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(1)",
mistakes:["Recalculating maxFreq by scanning all 26 chars each time","Not realizing maxFreq never needs to decrease","Using while instead of if for shrinking (both work but if is elegant)"],
trick:"🧠 'Window - MostFreqChar ≤ K replacements allowed.' Keep the majority, replace the minority!"
},
{id:15,topic:"Strings",pattern:"Sliding Window (String)",title:"Permutation in String (Anagram Substring)",difficulty:"medium",
intuition:"Fixed window of size len(s1). Slide over s2. Compare character frequencies. If match → permutation found.",
visual:'s1="ab", s2="eidbaooo"\nWindow size=2, need freq: {a:1,b:1}\n[ei]→no [id]→no [db]→no [ba]→YES! a:1,b:1 match!',
steps:["Build frequency map of s1","Window of size len(s1) on s2","Track matches (how many chars have correct freq)","Slide window: add right char, remove left char","If matches == 26 → return true"],
code:`class Solution {
    public boolean checkInclusion(String s1, String s2) {
        if (s1.length() > s2.length()) return false;
        int[] s1f = new int[26], s2f = new int[26];
        int matches = 0;
        for (int i = 0; i < s1.length(); i++) {
            s1f[s1.charAt(i)-'a']++;
            s2f[s2.charAt(i)-'a']++;
        }
        for (int i = 0; i < 26; i++)
            if (s1f[i] == s2f[i]) matches++;
        for (int i = s1.length(); i < s2.length(); i++) {
            if (matches == 26) return true;
            int r = s2.charAt(i) - 'a';
            s2f[r]++;
            if (s2f[r] == s1f[r]) matches++;
            else if (s2f[r] == s1f[r]+1) matches--;
            int l = s2.charAt(i-s1.length()) - 'a';
            s2f[l]--;
            if (s2f[l] == s1f[l]) matches++;
            else if (s2f[l] == s1f[l]-1) matches--;
        }
        return matches == 26;
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(1)",
mistakes:["Sorting each window O(n·mlogm) instead of frequency counting","Not handling the edge case s1 longer than s2","Comparing arrays directly instead of tracking matches incrementally"],
trick:"🧠 'Fixed-size window + freq match = anagram detector.' Slide a magnifying glass of size |s1| over s2."
},
{id:16,topic:"Strings",pattern:"Sliding Window (String)",title:"Group Anagrams",difficulty:"medium",
intuition:"Anagrams have same sorted string or same char frequency. Group by sorted key using HashMap.",
visual:'["eat","tea","tan","ate","nat","bat"]\nSort keys: "aet"→[eat,tea,ate], "ant"→[tan,nat], "abt"→[bat]',
steps:["For each string, compute key","Key = sorted string or char count","HashMap<key, list of strings>","Group strings with same key","Return all groups"],
code:`class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> map = new HashMap<>();
        for (String s : strs) {
            char[] ca = s.toCharArray();
            Arrays.sort(ca);
            String key = new String(ca);
            map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }
        return new ArrayList<>(map.values());
    }
}`,
timeComplexity:"O(n·k·log k)",spaceComplexity:"O(n·k)",
mistakes:["Using O(n²) pairwise comparison","Not considering empty strings","Using char count key but wrong format (need delimiter between counts)"],
trick:"🧠 'Same letters, different order = same sorted key.' Anagrams are just scrambled twins — sort to unscramble!"
},
{id:17,topic:"Strings",pattern:"Two Pointer (Palindrome)",title:"Palindromic Substrings (Count All)",difficulty:"medium",
intuition:"Expand around each center (both odd and even). Count every valid expansion as a palindrome.",
visual:'"aaa"\nCenters: a(3) + aa(2) + aaa(1) = 6 palindromes\na|a|a + aa|aa + aaa = 6',
steps:["For each index i","Expand odd: center (i,i)","Expand even: center (i,i+1)","Each successful expansion = +1 palindrome","Sum all counts"],
code:`class Solution {
    int count = 0;
    public int countSubstrings(String s) {
        for (int i = 0; i < s.length(); i++) {
            expand(s, i, i);
            expand(s, i, i + 1);
        }
        return count;
    }
    void expand(String s, int l, int r) {
        while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {
            count++;
            l--; r++;
        }
    }
}`,
timeComplexity:"O(n²)",spaceComplexity:"O(1)",
mistakes:["Only counting distinct palindromes (problem asks all)","Missing even-length palindromes","Using DP when expand is simpler and uses O(1) space"],
trick:"🧠 'Same as longest palindrome, but COUNT every expansion step instead of tracking max length.'"
},
{id:18,topic:"Strings",pattern:"Two Pointer (Palindrome)",title:"String to Integer (atoi)",difficulty:"medium",
intuition:"Parse string: skip whitespace → read sign → read digits → clamp to INT range. Handle edge cases carefully.",
visual:'"   -42"\n  skip spaces → "-42"\n  read sign → negative\n  read digits → 4, 2 → result = -42\n  clamp to [-2^31, 2^31-1]',
steps:["Skip leading whitespace","Check for +/- sign","Read consecutive digits","Build number: result = result*10 + digit","Clamp to [INT_MIN, INT_MAX]"],
code:`class Solution {
    public int myAtoi(String s) {
        int i = 0, n = s.length(), sign = 1;
        long result = 0;
        while (i < n && s.charAt(i) == ' ') i++;
        if (i < n && (s.charAt(i) == '+' || s.charAt(i) == '-'))
            sign = s.charAt(i++) == '-' ? -1 : 1;
        while (i < n && Character.isDigit(s.charAt(i))) {
            result = result * 10 + (s.charAt(i++) - '0');
            if (result * sign > Integer.MAX_VALUE) return Integer.MAX_VALUE;
            if (result * sign < Integer.MIN_VALUE) return Integer.MIN_VALUE;
        }
        return (int)(result * sign);
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(1)",
mistakes:["Not handling overflow (result exceeds int range mid-parse)","Processing chars after first non-digit","Handling multiple signs like '+-12'"],
trick:"🧠 'Skip-Sign-Digits-Clamp: 4 steps, that is it.' Parse like a robot: spaces→sign→digits→overflow check."
},
{id:19,topic:"Strings",pattern:"Sliding Window (String)",title:"Longest Common Prefix",difficulty:"easy",
intuition:"Take first string as prefix. Compare with each string, shrink prefix until it matches. Vertical or horizontal scan.",
visual:'["flower","flow","flight"]\nprefix="flower"\nvs "flow" → "flow" (shrink)\nvs "flight" → "fl" (shrink)\nResult: "fl"',
steps:["Start with prefix = strs[0]","For each remaining string","While string doesn't start with prefix","Remove last char of prefix","If prefix empty → return empty"],
code:`class Solution {
    public String longestCommonPrefix(String[] strs) {
        if (strs.length == 0) return "";
        String prefix = strs[0];
        for (int i = 1; i < strs.length; i++) {
            while (strs[i].indexOf(prefix) != 0) {
                prefix = prefix.substring(0, prefix.length() - 1);
                if (prefix.isEmpty()) return "";
            }
        }
        return prefix;
    }
}`,
timeComplexity:"O(S) where S = sum of all chars",spaceComplexity:"O(1)",
mistakes:["Not handling empty array input","Using charAt comparison but going past shorter string length","Sorting approach works but is O(n·k·log n)"],
trick:"🧠 'Start with the FULL first word, then CHOP from the end until everyone agrees. Consensus by trimming!'"
},
{id:20,topic:"Strings",pattern:"Sliding Window (String)",title:"Encode and Decode Strings",difficulty:"medium",
intuition:"Prefix each string with its length and a delimiter. '4#code5#ninja' → decode by reading length, then extracting.",
visual:'Encode: ["code","ninja"] → "4#code5#ninja"\nDecode: read 4 → "code", read 5 → "ninja"',
steps:["Encode: for each s, append len(s) + '#' + s","Decode: read number until '#'","Extract next n characters as string","Continue until end of encoded string"],
code:`class Solution {
    public String encode(List<String> strs) {
        StringBuilder sb = new StringBuilder();
        for (String s : strs)
            sb.append(s.length()).append('#').append(s);
        return sb.toString();
    }
    public List<String> decode(String s) {
        List<String> res = new ArrayList<>();
        int i = 0;
        while (i < s.length()) {
            int j = i;
            while (s.charAt(j) != '#') j++;
            int len = Integer.parseInt(s.substring(i, j));
            res.add(s.substring(j+1, j+1+len));
            i = j + 1 + len;
        }
        return res;
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(n)",
mistakes:["Using a simple delimiter that could appear in strings","Not handling empty strings in the list","Integer overflow for very long strings"],
trick:"🧠 'Length-prefix encoding: tell me HOW MANY chars to read before I read them.' Like a postal package with weight label!"
}
];

// Batch 3: Binary Search (Q21-Q30)
var BATCH3 = [
{id:21,topic:"Binary Search",pattern:"Classic Binary Search",title:"Binary Search",difficulty:"easy",
intuition:"Divide sorted array in half each step. Compare target with mid. Go left or right accordingly.",
visual:"[1,3,5,7,9,11] target=7\nL=0 R=5 M=2(5) → 5<7 → L=3\nL=3 R=5 M=4(9) → 9>7 → R=3\nL=3 R=3 M=3(7) → FOUND!",
steps:["L=0, R=n-1","mid = L+(R-L)/2","If arr[mid]==target → return mid","If arr[mid]<target → L=mid+1","If arr[mid]>target → R=mid-1"],
code:`class Solution {
    public int search(int[] nums, int target) {
        int l = 0, r = nums.length - 1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] == target) return mid;
            else if (nums[mid] < target) l = mid + 1;
            else r = mid - 1;
        }
        return -1;
    }
}`,
timeComplexity:"O(log n)",spaceComplexity:"O(1)",
mistakes:["Using (l+r)/2 causing integer overflow","Wrong loop condition: l < r vs l <= r","Not handling empty array"],
trick:"🧠 'L+(R-L)/2 avoids overflow. <= means search includes single element. Halve the haystack each time!'"
},
{id:22,topic:"Binary Search",pattern:"Classic Binary Search",title:"Search in Rotated Sorted Array",difficulty:"medium",
intuition:"One half is always sorted. Determine which half is sorted, check if target is in that half, then narrow.",
visual:"[4,5,6,7,0,1,2] target=0\nL=0 R=6 M=3(7)\nLeft [4,5,6,7] sorted, 0 not in [4,7] → go right\nL=4 R=6 M=5(1)\nLeft [0,1] sorted, 0 in [0,1] → go left\nL=4 R=4 M=4(0) → FOUND!",
steps:["L=0, R=n-1, find mid","If nums[mid]==target → return","If left half sorted (nums[L]<=nums[mid])","  Check if target in [L,mid) → go left, else right","Else right half sorted → similar check"],
code:`class Solution {
    public int search(int[] nums, int target) {
        int l = 0, r = nums.length - 1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] == target) return mid;
            if (nums[l] <= nums[mid]) {
                if (target >= nums[l] && target < nums[mid]) r = mid - 1;
                else l = mid + 1;
            } else {
                if (target > nums[mid] && target <= nums[r]) l = mid + 1;
                else r = mid - 1;
            }
        }
        return -1;
    }
}`,
timeComplexity:"O(log n)",spaceComplexity:"O(1)",
mistakes:["Not using <= in nums[l]<=nums[mid] (fails when l==mid)","Forgetting to check boundary values in range check","Confusing which half to search"],
trick:"🧠 'One half is ALWAYS sorted in rotated array. Find the sorted half → check if target lives there → narrow down.'"
},
{id:23,topic:"Binary Search",pattern:"Lower / Upper Bound",title:"Find First and Last Position",difficulty:"medium",
intuition:"Two binary searches: one for leftmost occurrence (first), one for rightmost (last). Modify boundary updates.",
visual:"[5,7,7,8,8,10] target=8\nFind first 8: L=0 R=5 → narrow left → idx=3\nFind last 8:  L=0 R=5 → narrow right → idx=4\nResult: [3,4]",
steps:["Binary search for first: when found, keep going left (r=mid-1)","Binary search for last: when found, keep going right (l=mid+1)","Store result each time target is found","Return [first, last]"],
code:`class Solution {
    public int[] searchRange(int[] nums, int target) {
        return new int[]{findBound(nums, target, true), findBound(nums, target, false)};
    }
    int findBound(int[] nums, int target, boolean isFirst) {
        int l = 0, r = nums.length - 1, result = -1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] == target) {
                result = mid;
                if (isFirst) r = mid - 1;
                else l = mid + 1;
            } else if (nums[mid] < target) l = mid + 1;
            else r = mid - 1;
        }
        return result;
    }
}`,
timeComplexity:"O(log n)",spaceComplexity:"O(1)",
mistakes:["Returning immediately on finding target (misses first/last)","Using linear scan after finding one occurrence","Not handling target not present in array"],
trick:"🧠 'Found it? Don\\'t stop! For FIRST → go left. For LAST → go right. Greedy binary search!'"
},
{id:24,topic:"Binary Search",pattern:"Binary Search on Answers",title:"Koko Eating Bananas",difficulty:"medium",
intuition:"Binary search on eating speed k. For each k, check if Koko can finish all piles within h hours. Find minimum k.",
visual:"piles=[3,6,7,11], h=8\nTry k=5: hours=1+2+2+3=8 ≤ 8 ✓ → try smaller\nTry k=3: hours=1+2+3+4=10 > 8 ✗ → try bigger\nTry k=4: hours=1+2+2+3=8 ≤ 8 ✓ → answer=4",
steps:["L=1, R=max(piles)","mid = candidate speed","Calculate total hours at speed mid","If hours <= h → try smaller (R=mid)","If hours > h → need faster (L=mid+1)"],
code:`class Solution {
    public int minEatingSpeed(int[] piles, int h) {
        int l = 1, r = 0;
        for (int p : piles) r = Math.max(r, p);
        while (l < r) {
            int mid = l + (r - l) / 2;
            int hours = 0;
            for (int p : piles) hours += (p + mid - 1) / mid;
            if (hours <= h) r = mid;
            else l = mid + 1;
        }
        return l;
    }
}`,
timeComplexity:"O(n·log(max))",spaceComplexity:"O(1)",
mistakes:["Using ceil division wrong: should be (p+k-1)/k","Search space wrong: L should be 1 not 0","Not using < vs <= correctly in loop condition"],
trick:"🧠 'Binary search THE ANSWER, not the array! Can Koko finish at speed K? If yes→try slower. If no→go faster.'"
},
{id:25,topic:"Binary Search",pattern:"Binary Search on Answers",title:"Capacity To Ship Packages (Within D Days)",difficulty:"medium",
intuition:"Binary search on ship capacity. Min capacity = max(weight), max = sum(weights). Find minimum feasible capacity.",
visual:"weights=[1,2,3,4,5,6,7,8,9,10], D=5\nTry cap=15: [1,2,3,4,5][6,7][8][9][10] = 5 days ✓\nTry cap=10: needs 6 days ✗\nAnswer: 15",
steps:["L=max(weights), R=sum(weights)","mid = candidate capacity","Simulate shipping: count days needed","If days <= D → try smaller capacity (R=mid)","If days > D → need bigger (L=mid+1)"],
code:`class Solution {
    public int shipWithinDays(int[] weights, int days) {
        int l = 0, r = 0;
        for (int w : weights) { l = Math.max(l, w); r += w; }
        while (l < r) {
            int mid = l + (r - l) / 2;
            int d = 1, cur = 0;
            for (int w : weights) {
                if (cur + w > mid) { d++; cur = 0; }
                cur += w;
            }
            if (d <= days) r = mid;
            else l = mid + 1;
        }
        return l;
    }
}`,
timeComplexity:"O(n·log(sum))",spaceComplexity:"O(1)",
mistakes:["Lower bound should be max(weights) not 0","Forgetting to start with day=1 (first day counts)","Using <= instead of < in feasibility check"],
trick:"🧠 'Can I ship everything in D days with capacity C? Binary search C from max_weight to total_weight.'"
},
{id:26,topic:"Binary Search",pattern:"Binary Search on Answers",title:"Split Array Largest Sum",difficulty:"hard",
intuition:"Binary search on the answer (max subarray sum). Check if we can split into ≤ k subarrays where each ≤ mid.",
visual:"nums=[7,2,5,10,8], k=2\nTry mid=18: [7,2,5|10,8]=2 splits ≤ 2 ✓\nTry mid=14: [7,2,5|10] needs 8→3 splits ✗\nTry mid=15: [7,2,5|10] + [8] = 2 ≤ 2 ✓ → try less\nAnswer: 18",
steps:["L=max(nums), R=sum(nums)","mid = candidate max sum","Greedily assign elements to subarrays","Count subarrays needed with max sum ≤ mid","If count ≤ k → R=mid, else L=mid+1"],
code:`class Solution {
    public int splitArray(int[] nums, int k) {
        int l = 0, r = 0;
        for (int n : nums) { l = Math.max(l, n); r += n; }
        while (l < r) {
            int mid = l + (r - l) / 2;
            int parts = 1, cur = 0;
            for (int n : nums) {
                if (cur + n > mid) { parts++; cur = 0; }
                cur += n;
            }
            if (parts <= k) r = mid;
            else l = mid + 1;
        }
        return l;
    }
}`,
timeComplexity:"O(n·log(sum))",spaceComplexity:"O(1)",
mistakes:["This is identical pattern to Ship Packages — recognize the template!","Lower bound must be max element (single element can't be split)","Greedy partitioning: start new partition when sum exceeds mid"],
trick:"🧠 'Minimize the maximum = Binary Search on Answer. Same template as Koko Bananas & Ship Packages!'"
},
{id:27,topic:"Binary Search",pattern:"Search in 2D Matrix",title:"Search a 2D Matrix",difficulty:"medium",
intuition:"Treat 2D matrix as flattened sorted array. Single binary search with row=mid/cols, col=mid%cols.",
visual:"Matrix 3x4, target=3:\n[1, 3, 5, 7]\n[10,11,16,20]\n[23,30,34,60]\nFlat index mid=5 → row=5/4=1, col=5%4=1 → val=11",
steps:["L=0, R=rows*cols-1","mid = L+(R-L)/2","row = mid/cols, col = mid%cols","Compare matrix[row][col] with target","Standard binary search logic"],
code:`class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int m = matrix.length, n = matrix[0].length;
        int l = 0, r = m * n - 1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            int val = matrix[mid / n][mid % n];
            if (val == target) return true;
            else if (val < target) l = mid + 1;
            else r = mid - 1;
        }
        return false;
    }
}`,
timeComplexity:"O(log(m·n))",spaceComplexity:"O(1)",
mistakes:["Using n (cols) for division, not m (rows) — mid/n gives row","Starting staircase search when single binary search works","Not handling empty matrix"],
trick:"🧠 'Flatten the 2D matrix mentally! row = idx/COLS, col = idx%COLS. One binary search, done!'"
},
{id:28,topic:"Binary Search",pattern:"Search in 2D Matrix",title:"Search a 2D Matrix II (Sorted Rows & Cols)",difficulty:"medium",
intuition:"Start from top-right corner. If target < current → move left. If target > current → move down. Staircase search.",
visual:"[1, 4, 7,11,15]\n[2, 5, 8,12,19]\n[3, 6, 9,16,22]\nTarget=5: Start at 15→11→7→4→5 FOUND!  (←↓ staircase)",
steps:["Start at top-right: row=0, col=n-1","If matrix[r][c] == target → found","If matrix[r][c] > target → col-- (go left)","If matrix[r][c] < target → row++ (go down)","Continue while in bounds"],
code:`class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int r = 0, c = matrix[0].length - 1;
        while (r < matrix.length && c >= 0) {
            if (matrix[r][c] == target) return true;
            else if (matrix[r][c] > target) c--;
            else r++;
        }
        return false;
    }
}`,
timeComplexity:"O(m+n)",spaceComplexity:"O(1)",
mistakes:["Starting from top-left (can't eliminate row or col)","Using binary search on each row O(m·log n) — works but slower","Confusing this with Matrix I (different structure)"],
trick:"🧠 'Top-right is the MAGIC corner! Left = smaller, Down = bigger. Like walking down stairs!'"
},
{id:29,topic:"Binary Search",pattern:"Lower / Upper Bound",title:"Find Minimum in Rotated Sorted Array",difficulty:"medium",
intuition:"Binary search: if mid > right, min is in right half. If mid < right, min is in left half (including mid).",
visual:"[3,4,5,1,2]\nL=0(3) R=4(2) M=2(5): 5>2 → min in right → L=3\nL=3(1) R=4(2) M=3(1): 1<2 → min in left → R=3\nL=3 R=3 → return nums[3]=1",
steps:["L=0, R=n-1","If nums[mid] > nums[R] → rotation point is right → L=mid+1","Else → min could be mid or left → R=mid","When L==R → found minimum"],
code:`class Solution {
    public int findMin(int[] nums) {
        int l = 0, r = nums.length - 1;
        while (l < r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] > nums[r]) l = mid + 1;
            else r = mid;
        }
        return nums[l];
    }
}`,
timeComplexity:"O(log n)",spaceComplexity:"O(1)",
mistakes:["Comparing with nums[l] instead of nums[r]","Using l <= r (infinite loop since r=mid)","Not handling already sorted array (no rotation)"],
trick:"🧠 'Compare mid with RIGHT end. If mid > right → inflection is on right. Simple!'"
},
{id:30,topic:"Binary Search",pattern:"Classic Binary Search",title:"Time Based Key-Value Store",difficulty:"medium",
intuition:"Store values with timestamps. For get(), binary search for largest timestamp ≤ given timestamp.",
visual:'set("foo",1,"bar"), set("foo",3,"bar2")\nget("foo",2) → binary search → timestamp 1 ≤ 2 → "bar"\nget("foo",4) → timestamp 3 ≤ 4 → "bar2"',
steps:["Use HashMap<String, List<(timestamp,value)>>","set: append to list (timestamps are increasing)","get: binary search for largest ts ≤ given ts","Return corresponding value","If no valid ts → return empty"],
code:`class TimeMap {
    Map<String, List<int[]>> map = new HashMap<>();
    // int[] = {timestamp}, separate list for values
    Map<String, List<String>> vals = new HashMap<>();
    
    public void set(String key, String value, int timestamp) {
        map.computeIfAbsent(key, k -> new ArrayList<>()).add(new int[]{timestamp});
        vals.computeIfAbsent(key, k -> new ArrayList<>()).add(value);
    }
    
    public String get(String key, int timestamp) {
        if (!map.containsKey(key)) return "";
        List<int[]> times = map.get(key);
        int l = 0, r = times.size() - 1, res = -1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (times.get(mid)[0] <= timestamp) { res = mid; l = mid + 1; }
            else r = mid - 1;
        }
        return res == -1 ? "" : vals.get(key).get(res);
    }
}`,
timeComplexity:"O(log n) get, O(1) set",spaceComplexity:"O(n)",
mistakes:["Linear scan instead of binary search for get()","Not handling case when all timestamps > query","Not leveraging that timestamps are strictly increasing"],
trick:"🧠 'Timestamps are auto-sorted! Binary search for floor value. Map + Binary Search = versioned store.'"
}
];

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

// Batch 5: Recursion + LinkedList (Q41-Q52)
var BATCH5 = [
{id:41,topic:"Recursion",pattern:"Linear Recursion",title:"Pow(x, n) — Fast Power",difficulty:"medium",
intuition:"x^n = (x^(n/2))^2 if even, x*(x^(n/2))^2 if odd. Reduces O(n) to O(log n) via divide and conquer.",
visual:"2^10 = (2^5)^2\n2^5 = 2*(2^2)^2\n2^2 = (2^1)^2\n2^1 = 2*(2^0)^2\n2^0 = 1\nOnly log₂(10)=4 multiplications!",
steps:["Base case: n==0 → return 1","If n<0 → x=1/x, n=-n","If n is even: return pow(x*x, n/2)","If n is odd: return x * pow(x*x, (n-1)/2)"],
code:`class Solution {
    public double myPow(double x, int n) {
        long N = n;
        if (N < 0) { x = 1/x; N = -N; }
        double res = 1;
        while (N > 0) {
            if (N % 2 == 1) res *= x;
            x *= x;
            N /= 2;
        }
        return res;
    }
}`,
timeComplexity:"O(log n)",spaceComplexity:"O(1)",
mistakes:["Not handling n=Integer.MIN_VALUE (overflow when negating)","Using long N to handle MIN_VALUE","Linear multiplication O(n) instead of fast power"],
trick:"🧠 'Square and halve! Even→square base, halve exp. Odd→multiply once, then square and halve.'"
},
{id:42,topic:"Recursion",pattern:"Non-Linear Recursion",title:"Subsets",difficulty:"medium",
intuition:"For each element, choose to include or exclude. Two branches at each step → 2^n total subsets.",
visual:"[1,2,3]\n            []\n       /         \\\n     [1]          []\n    /   \\        /   \\\n  [1,2]  [1]  [2]    []\n  / \\   / \\   / \\   / \\\n[123][12][13][1][23][2][3][]",
steps:["Start with empty subset","For each element: include or exclude","Recurse on remaining elements","Base case: index == n → add current subset","Backtrack after recursive call"],
code:`class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        backtrack(res, new ArrayList<>(), nums, 0);
        return res;
    }
    void backtrack(List<List<Integer>> res, List<Integer> cur, int[] nums, int idx) {
        if (idx == nums.length) { res.add(new ArrayList<>(cur)); return; }
        cur.add(nums[idx]);
        backtrack(res, cur, nums, idx + 1);
        cur.remove(cur.size() - 1);
        backtrack(res, cur, nums, idx + 1);
    }
}`,
timeComplexity:"O(2^n)",spaceComplexity:"O(n)",
mistakes:["Not creating new ArrayList when adding to result","Forgetting to backtrack (remove last element)","Using indices wrong causing duplicates"],
trick:"🧠 'Include or Exclude — binary choice tree! 2^n leaves = 2^n subsets. Backtrack = undo the include.'"
},
{id:43,topic:"Recursion",pattern:"Subsequences",title:"Combination Sum",difficulty:"medium",
intuition:"Backtrack with same element reusable. Sort to prune early. If sum exceeds target, stop exploring.",
visual:"candidates=[2,3,6,7], target=7\n[2]→[2,2]→[2,2,2]→[2,2,3]=7✓\n[2,3]→over... [3]→[3,3]→over\n[7]=7✓  Result:[[2,2,3],[7]]",
steps:["Sort candidates","Backtrack from index i","Add candidate, recurse with SAME index (reuse)","If sum > target → return","If sum == target → add to result"],
code:`class Solution {
    public List<List<Integer>> combinationSum(int[] cand, int target) {
        List<List<Integer>> res = new ArrayList<>();
        Arrays.sort(cand);
        backtrack(res, new ArrayList<>(), cand, target, 0);
        return res;
    }
    void backtrack(List<List<Integer>> res, List<Integer> cur, int[] cand, int rem, int start) {
        if (rem == 0) { res.add(new ArrayList<>(cur)); return; }
        for (int i = start; i < cand.length; i++) {
            if (cand[i] > rem) break;
            cur.add(cand[i]);
            backtrack(res, cur, cand, rem - cand[i], i);
            cur.remove(cur.size() - 1);
        }
    }
}`,
timeComplexity:"O(2^t) where t=target",spaceComplexity:"O(target)",
mistakes:["Using i+1 instead of i (prevents reuse of same element)","Not sorting → can't prune early","Forgetting break when candidate > remaining"],
trick:"🧠 'Same index = reuse allowed! i+1 = no reuse. Sort + break early when candidate > remaining.'"
},
{id:44,topic:"Recursion",pattern:"Divide & Conquer",title:"Merge Sort",difficulty:"medium",
intuition:"Divide array in half, recursively sort each half, merge two sorted halves. Stable, O(n log n) guaranteed.",
visual:"[38,27,43,3,9,82,10]\n  [38,27,43,3] [9,82,10]\n  [38,27][43,3] [9,82][10]\n  sort & merge up:\n  [27,38][3,43] [9,82][10]\n  [3,27,38,43] [9,10,82]\n  [3,9,10,27,38,43,82]",
steps:["If array size <= 1 → return","Split at mid","Recursively sort left half","Recursively sort right half","Merge two sorted halves"],
code:`class Solution {
    public void mergeSort(int[] arr, int l, int r) {
        if (l >= r) return;
        int mid = l + (r - l) / 2;
        mergeSort(arr, l, mid);
        mergeSort(arr, mid + 1, r);
        merge(arr, l, mid, r);
    }
    void merge(int[] arr, int l, int mid, int r) {
        int[] temp = new int[r - l + 1];
        int i = l, j = mid + 1, k = 0;
        while (i <= mid && j <= r)
            temp[k++] = arr[i] <= arr[j] ? arr[i++] : arr[j++];
        while (i <= mid) temp[k++] = arr[i++];
        while (j <= r) temp[k++] = arr[j++];
        System.arraycopy(temp, 0, arr, l, temp.length);
    }
}`,
timeComplexity:"O(n log n)",spaceComplexity:"O(n)",
mistakes:["Not copying back to original array","Off-by-one in merge boundaries","Using < instead of <= for stability"],
trick:"🧠 'Split in half, sort halves, merge sorted halves. Like sorting two stacks of cards then interleaving them.'"
},
{id:45,topic:"LinkedList",pattern:"Basic Operations",title:"Reverse Linked List",difficulty:"easy",
intuition:"Three pointers: prev, curr, next. Save next, point curr to prev, advance both. Simple iterative reversal.",
visual:"1→2→3→4→null\nprev=null, curr=1\n1←  2→3→4  (1.next=null)\n1←2  3→4  (2.next=1)\n1←2←3  4  (3.next=2)\n1←2←3←4  (4.next=3)\nnull←1←2←3←4",
steps:["prev=null, curr=head","Save next = curr.next","curr.next = prev (reverse link)","prev = curr","curr = next","Return prev (new head)"],
code:`class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null, curr = head;
        while (curr != null) {
            ListNode next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(1)",
mistakes:["Losing reference to next node before reversing","Returning head instead of prev","Not handling null/single node"],
trick:"🧠 'Save-Reverse-Advance: save next, reverse pointer, move forward. prev ends up as new head!'"
},
{id:46,topic:"LinkedList",pattern:"Fast and Slow Pointers",title:"Linked List Cycle",difficulty:"easy",
intuition:"Floyd's algorithm: slow moves 1 step, fast moves 2 steps. If cycle exists, they will meet.",
visual:"1→2→3→4→5\n        ↑   ↓\n        ←←←\nSlow: 1,2,3,4,5,3,4...\nFast: 1,3,5,4,3,5,4...\nMeet at node with cycle!",
steps:["slow = head, fast = head","Move slow by 1, fast by 2","If fast == null → no cycle","If slow == fast → cycle found","Return true/false"],
code:`class Solution {
    public boolean hasCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true;
        }
        return false;
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(1)",
mistakes:["Not checking fast.next != null (NPE)","Checking equality before first move","Using HashSet (works but O(n) space)"],
trick:"🧠 'Tortoise & Hare: if there is a cycle, fast WILL lap slow. Like runners on a circular track!'"
},
{id:47,topic:"LinkedList",pattern:"Fast and Slow Pointers",title:"Find Middle of Linked List",difficulty:"easy",
intuition:"Slow moves 1 step, fast moves 2 steps. When fast reaches end, slow is at middle.",
visual:"1→2→3→4→5\nS:1,2,3  F:1,3,5\nWhen F at end, S at middle(3)!\n\n1→2→3→4→5→6\nS:1,2,3,4  F:1,3,5,null\nS at 4 (2nd middle)",
steps:["slow = head, fast = head","While fast && fast.next","slow = slow.next","fast = fast.next.next","Return slow"],
code:`class Solution {
    public ListNode middleNode(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        return slow;
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(1)",
mistakes:["For even-length list: this returns 2nd middle (adjust if 1st needed)","Null check order matters: fast != null first","Counting length then traversing half (two passes)"],
trick:"🧠 'Fast goes 2x speed. When fast finishes the race, slow is exactly at halfway!'"
},
{id:48,topic:"LinkedList",pattern:"Reversal Pattern",title:"Reverse Nodes in k-Group",difficulty:"hard",
intuition:"Count k nodes ahead. If k nodes exist, reverse that segment. Connect reversed segment. Recurse for rest.",
visual:"1→2→3→4→5, k=2\nReverse [1,2]: 2→1  →3→4→5\nReverse [3,4]: 2→1→4→3  →5\nRemaining <k: 2→1→4→3→5",
steps:["Check if k nodes available","If yes → reverse k nodes","Connect tail of reversed to result of recursion","If no → return head as is","Use recursion or iterative with dummy node"],
code:`class Solution {
    public ListNode reverseKGroup(ListNode head, int k) {
        ListNode curr = head;
        int count = 0;
        while (curr != null && count < k) { curr = curr.next; count++; }
        if (count < k) return head;
        ListNode prev = reverseKGroup(curr, k);
        while (count-- > 0) {
            ListNode next = head.next;
            head.next = prev;
            prev = head;
            head = next;
        }
        return prev;
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(n/k) recursion",
mistakes:["Reversing even when remaining nodes < k","Not connecting reversed group to next group","Losing pointer to the next group's start"],
trick:"🧠 'Check k nodes exist → reverse that chunk → recurse for the rest. Recursion handles the stitching!'"
},
{id:49,topic:"LinkedList",pattern:"Merge / Sort",title:"Merge Two Sorted Lists",difficulty:"easy",
intuition:"Compare heads of both lists. Pick smaller, advance that list. Continue until one is exhausted.",
visual:"L1: 1→3→5  L2: 2→4→6\nCompare 1,2 → pick 1\nCompare 3,2 → pick 2\nCompare 3,4 → pick 3\nCompare 5,4 → pick 4\nResult: 1→2→3→4→5→6",
steps:["Create dummy head","While both lists non-null","Pick smaller node, attach to result","Advance that list's pointer","Attach remaining non-null list at end"],
code:`class Solution {
    public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0), curr = dummy;
        while (l1 != null && l2 != null) {
            if (l1.val <= l2.val) { curr.next = l1; l1 = l1.next; }
            else { curr.next = l2; l2 = l2.next; }
            curr = curr.next;
        }
        curr.next = (l1 != null) ? l1 : l2;
        return dummy.next;
    }
}`,
timeComplexity:"O(n+m)",spaceComplexity:"O(1)",
mistakes:["Forgetting to attach remaining list at end","Not using dummy head (complex edge cases)","Creating new nodes instead of reusing existing"],
trick:"🧠 'Dummy head avoids edge cases! Compare, pick smaller, advance. Attach leftover at end.'"
},
{id:50,topic:"LinkedList",pattern:"LinkedList with Stack/HashMap",title:"Add Two Numbers (Linked List)",difficulty:"medium",
intuition:"Numbers stored in reverse order. Add digit by digit with carry. Create new node for each sum digit.",
visual:"L1: 2→4→3 (342)\nL2: 5→6→4 (465)\n2+5=7, 4+6=10(0 carry 1), 3+4+1=8\nResult: 7→0→8 (807)",
steps:["Traverse both lists simultaneously","sum = l1.val + l2.val + carry","New node val = sum % 10","carry = sum / 10","Continue until both null AND carry is 0"],
code:`class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0), curr = dummy;
        int carry = 0;
        while (l1 != null || l2 != null || carry > 0) {
            int sum = carry;
            if (l1 != null) { sum += l1.val; l1 = l1.next; }
            if (l2 != null) { sum += l2.val; l2 = l2.next; }
            carry = sum / 10;
            curr.next = new ListNode(sum % 10);
            curr = curr.next;
        }
        return dummy.next;
    }
}`,
timeComplexity:"O(max(m,n))",spaceComplexity:"O(max(m,n))",
mistakes:["Forgetting final carry (e.g., 5+5=10)","Not handling different-length lists","Trying to convert to integer (overflow for large numbers)"],
trick:"🧠 'Grade school addition, digit by digit! carry = sum/10, digit = sum%10. Don\\'t forget the final carry!'"
},
{id:51,topic:"LinkedList",pattern:"Fast and Slow Pointers",title:"Remove Nth Node From End",difficulty:"medium",
intuition:"Two pointers n apart. When fast reaches end, slow is at the node BEFORE the one to remove.",
visual:"1→2→3→4→5, n=2\nfast moves 2 ahead: at 3\nBoth move: fast=5, slow=3\nslow.next = slow.next.next → skip 4\nResult: 1→2→3→5",
steps:["Use dummy node before head","Fast moves n steps ahead","Both move until fast.next is null","slow.next = slow.next.next","Return dummy.next"],
code:`class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0, head);
        ListNode fast = dummy, slow = dummy;
        for (int i = 0; i <= n; i++) fast = fast.next;
        while (fast != null) { fast = fast.next; slow = slow.next; }
        slow.next = slow.next.next;
        return dummy.next;
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(1)",
mistakes:["Not using dummy node (fails when removing head)","Moving fast n steps vs n+1 steps (need to land BEFORE target)","Two-pass approach works but one-pass is elegant"],
trick:"🧠 'Gap technique: create n-gap between fast and slow. When fast hits end, slow is just before the target!'"
},
{id:52,topic:"LinkedList",pattern:"Merge / Sort",title:"Sort Linked List (Merge Sort)",difficulty:"medium",
intuition:"Find middle using slow/fast. Split into two halves. Recursively sort both. Merge sorted halves.",
visual:"4→2→1→3\nSplit: [4→2] [1→3]\nSort:  [2→4] [1→3]\nMerge: 1→2→3→4",
steps:["Base case: null or single node","Find middle with slow/fast pointers","Split list at middle","Recursively sort both halves","Merge two sorted lists"],
code:`class Solution {
    public ListNode sortList(ListNode head) {
        if (head == null || head.next == null) return head;
        ListNode slow = head, fast = head.next;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        ListNode mid = slow.next;
        slow.next = null;
        ListNode left = sortList(head);
        ListNode right = sortList(mid);
        return merge(left, right);
    }
    ListNode merge(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0), c = dummy;
        while (l1 != null && l2 != null) {
            if (l1.val <= l2.val) { c.next = l1; l1 = l1.next; }
            else { c.next = l2; l2 = l2.next; }
            c = c.next;
        }
        c.next = l1 != null ? l1 : l2;
        return dummy.next;
    }
}`,
timeComplexity:"O(n log n)",spaceComplexity:"O(log n) recursion",
mistakes:["Not cutting the list (slow.next = null)","Using fast=head instead of fast=head.next for even split","Infinite recursion if not properly splitting single element"],
trick:"🧠 'Merge sort on linked list: find mid → CUT → sort halves → merge. Perfect fit since merge is O(1) space!'"
}
];

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

// Batch 7: BST + Graphs (Q65-Q76)
var BATCH7 = [
{id:65,topic:"BST",pattern:"BST Operations",title:"Validate BST",difficulty:"medium",
intuition:"DFS with min/max range. Each node must be within (min, max). Left child tightens max, right tightens min.",
visual:"    5\n   / \\\n  1   7\n     / \\\n    6   8  → 6 is between 5 and 7? YES ✓\nAll nodes satisfy their range constraints.",
steps:["Pass min=-∞, max=+∞ initially","If node.val <= min or >= max → false","Recurse left with (min, node.val)","Recurse right with (node.val, max)","All checks pass → true"],
code:`class Solution {
    public boolean isValidBST(TreeNode root) {
        return validate(root, Long.MIN_VALUE, Long.MAX_VALUE);
    }
    boolean validate(TreeNode node, long min, long max) {
        if (node == null) return true;
        if (node.val <= min || node.val >= max) return false;
        return validate(node.left, min, node.val) &&
               validate(node.right, node.val, max);
    }
}`,
timeComplexity:"O(n)",spaceComplexity:"O(h)",
mistakes:["Only comparing with parent (grandparent constraints missed)","Using int instead of long for min/max bounds","Not using strict inequality (BST has no duplicates)"],
trick:"🧠 'Every node has a VALID RANGE. Left shrinks upper bound, right shrinks lower bound. Pass the range down!'"
},
{id:66,topic:"BST",pattern:"BST Operations",title:"Kth Smallest Element in BST",difficulty:"medium",
intuition:"Inorder traversal of BST gives sorted order. The kth element in inorder is the kth smallest.",
visual:"    5\n   / \\\n  3   6\n / \\\n2   4\nInorder: 2,3,4,5,6\nk=3 → answer = 4",
steps:["Do inorder traversal (left, root, right)","Count nodes visited","When count reaches k → return current node","Can use iterative with stack for early termination"],
code:`class Solution {
    int count = 0, result = 0;
    public int kthSmallest(TreeNode root, int k) {
        inorder(root, k);
        return result;
    }
    void inorder(TreeNode node, int k) {
        if (node == null) return;
        inorder(node.left, k);
        if (++count == k) { result = node.val; return; }
        inorder(node.right, k);
    }
}`,
timeComplexity:"O(h+k)",spaceComplexity:"O(h)",
mistakes:["Collecting all elements then returning k-1 index (unnecessary O(n) space)","Not stopping early after finding kth element","Off-by-one: 1-indexed k vs 0-indexed"],
trick:"🧠 'Inorder = sorted BST. Count during traversal. Stop at k. No need to collect everything!'"
},
{id:67,topic:"BST",pattern:"LCA & Range Queries",title:"LCA of BST",difficulty:"medium",
intuition:"Exploit BST property: if both p,q < root → go left. Both > root → go right. Split → root is LCA.",
visual:"    6\n   / \\\n  2   8\n / \\ / \\\n0  4 7  9\nLCA(2,8): 2<6 and 8>6 → split! LCA=6\nLCA(2,4): both<6 → go left → both in subtree of 2 → LCA=2",
steps:["If both p,q < root → LCA is in left subtree","If both p,q > root → LCA is in right subtree","If they split (one left, one right) → root is LCA","Also if root == p or q → root is LCA"],
code:`class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        while (root != null) {
            if (p.val < root.val && q.val < root.val) root = root.left;
            else if (p.val > root.val && q.val > root.val) root = root.right;
            else return root;
        }
        return null;
    }
}`,
timeComplexity:"O(h)",spaceComplexity:"O(1)",
mistakes:["Not leveraging BST property (using general LCA algorithm)","Forgetting case when root itself is p or q","Using recursion when iterative is simpler for BST"],
trick:"🧠 'BST LCA = find the SPLIT POINT! Both left→go left. Both right→go right. Split→you are the LCA!'"
},
{id:68,topic:"Graphs",pattern:"BFS (Unweighted Path)",title:"Number of Islands",difficulty:"medium",
intuition:"BFS/DFS from each unvisited '1'. Mark connected land as visited. Each BFS/DFS start = one island.",
visual:'["11110",\n "11010",\n "11000",\n "00000"]\nBFS from (0,0) marks all connected 1s → island 1\nBFS from (1,3) → island 2\nTotal: 2 islands',
steps:["Iterate grid","On finding '1' → increment count","BFS/DFS to mark all connected '1' as '0'","Continue scanning for next unvisited '1'"],
code:`class Solution {
    public int numIslands(char[][] grid) {
        int count = 0;
        for (int i = 0; i < grid.length; i++)
            for (int j = 0; j < grid[0].length; j++)
                if (grid[i][j] == '1') { count++; dfs(grid, i, j); }
        return count;
    }
    void dfs(char[][] g, int i, int j) {
        if (i < 0 || j < 0 || i >= g.length || j >= g[0].length || g[i][j] != '1') return;
        g[i][j] = '0';
        dfs(g, i+1, j); dfs(g, i-1, j); dfs(g, i, j+1); dfs(g, i, j-1);
    }
}`,
timeComplexity:"O(m·n)",spaceComplexity:"O(m·n) recursion",
mistakes:["Not marking visited (infinite loop)","Forgetting diagonal is NOT connected (4-directional only)","Using separate visited array when modifying grid works"],
trick:"🧠 'Each DFS/BFS flood-fills one island. Count how many times you start a new flood. Grid modification = visited!'"
},
{id:69,topic:"Graphs",pattern:"BFS (Unweighted Path)",title:"Rotting Oranges",difficulty:"medium",
intuition:"Multi-source BFS. All rotten oranges start simultaneously. Each minute, rot spreads to adjacent fresh oranges.",
visual:"[2,1,1]    [2,2,1]    [2,2,2]    [2,2,2]\n[1,1,0] →  [2,1,0] →  [2,2,0] →  [2,2,0]\n[0,1,1]    [0,1,1]    [0,2,1]    [0,2,2]\n min=0      min=1      min=2      min=3  ✗ →4",
steps:["Add all rotten oranges to queue","Count fresh oranges","BFS level by level (each level = 1 minute)","Rot adjacent fresh oranges, decrement fresh count","If fresh > 0 at end → return -1, else return minutes"],
code:`class Solution {
    public int orangesRotting(int[][] grid) {
        Queue<int[]> q = new LinkedList<>();
        int fresh = 0, m = grid.length, n = grid[0].length;
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 2) q.offer(new int[]{i, j});
                else if (grid[i][j] == 1) fresh++;
            }
        int mins = 0;
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        while (!q.isEmpty() && fresh > 0) {
            mins++;
            int size = q.size();
            for (int i = 0; i < size; i++) {
                int[] cell = q.poll();
                for (int[] d : dirs) {
                    int r = cell[0]+d[0], c = cell[1]+d[1];
                    if (r>=0 && c>=0 && r<m && c<n && grid[r][c]==1) {
                        grid[r][c] = 2; fresh--; q.offer(new int[]{r, c});
                    }
                }
            }
        }
        return fresh == 0 ? mins : -1;
    }
}`,
timeComplexity:"O(m·n)",spaceComplexity:"O(m·n)",
mistakes:["Not using multi-source BFS (processing one rotten at a time)","Off-by-one in minute counting","Not checking if fresh oranges remain at end"],
trick:"🧠 'Multi-source BFS = simultaneous spread! All rotten in queue at start. Each BFS level = 1 minute.'"
},
{id:70,topic:"Graphs",pattern:"DFS (Connectivity)",title:"Clone Graph",difficulty:"medium",
intuition:"DFS with HashMap mapping original→clone. For each node, create clone, recursively clone neighbors.",
visual:"1 — 2\n|   |\n4 — 3\nClone 1→1', visit neighbors\n2→2', 4→4', 3→3'\nConnect cloned neighbors",
steps:["HashMap<Node, CloneNode>","If node already cloned → return clone","Create clone of current node","For each neighbor → recursively clone","Add cloned neighbors to clone's list"],
code:`class Solution {
    Map<Node, Node> map = new HashMap<>();
    public Node cloneGraph(Node node) {
        if (node == null) return null;
        if (map.containsKey(node)) return map.get(node);
        Node clone = new Node(node.val);
        map.put(node, clone);
        for (Node n : node.neighbors)
            clone.neighbors.add(cloneGraph(n));
        return clone;
    }
}`,
timeComplexity:"O(V+E)",spaceComplexity:"O(V)",
mistakes:["Not using HashMap → cloning same node multiple times","Creating infinite loop without visited check","Not cloning neighbors recursively (shallow copy)"],
trick:"🧠 'Map = visited + clone storage! If already cloned → return it. Else create clone → recurse neighbors.'"
},
{id:71,topic:"Graphs",pattern:"Topological Sort",title:"Course Schedule",difficulty:"medium",
intuition:"Detect cycle in directed graph. If cycle exists → can't finish all courses. Use Kahn's BFS or DFS.",
visual:"courses=4, [[1,0],[2,0],[3,1],[3,2]]\n0→1→3\n0→2→3\nNo cycle → can finish! topological order: 0,1,2,3",
steps:["Build adjacency list and indegree array","Add all 0-indegree nodes to queue","BFS: process node, reduce neighbors' indegree","If neighbor indegree becomes 0 → add to queue","If processed count == numCourses → true"],
code:`class Solution {
    public boolean canFinish(int n, int[][] prereqs) {
        List<List<Integer>> adj = new ArrayList<>();
        int[] indegree = new int[n];
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] p : prereqs) {
            adj.get(p[1]).add(p[0]);
            indegree[p[0]]++;
        }
        Queue<Integer> q = new LinkedList<>();
        for (int i = 0; i < n; i++)
            if (indegree[i] == 0) q.offer(i);
        int count = 0;
        while (!q.isEmpty()) {
            int node = q.poll(); count++;
            for (int nei : adj.get(node))
                if (--indegree[nei] == 0) q.offer(nei);
        }
        return count == n;
    }
}`,
timeComplexity:"O(V+E)",spaceComplexity:"O(V+E)",
mistakes:["Wrong edge direction: [a,b] means b→a (b is prereq of a)","Not handling disconnected components","Using DFS without proper 3-color cycle detection"],
trick:"🧠 'Kahn\\'s BFS: start with 0-indegree. Peel layers. If all peeled → no cycle → can finish!'"
},
{id:72,topic:"Graphs",pattern:"Topological Sort",title:"Course Schedule II (Order)",difficulty:"medium",
intuition:"Same as Course Schedule but record the order. Kahn's BFS gives topological ordering directly.",
visual:"n=4, [[1,0],[2,0],[3,1],[3,2]]\nIndegree: 0→0, 1→1, 2→1, 3→2\nProcess: 0→order=[0], reduce 1,2\n1→order=[0,1], 2→order=[0,1,2]\n3→order=[0,1,2,3]",
steps:["Same as Course Schedule","Record order as nodes are processed","If final order length != n → cycle exists → return empty","Else return order array"],
code:`class Solution {
    public int[] findOrder(int n, int[][] prereqs) {
        List<List<Integer>> adj = new ArrayList<>();
        int[] indegree = new int[n];
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] p : prereqs) {
            adj.get(p[1]).add(p[0]);
            indegree[p[0]]++;
        }
        Queue<Integer> q = new LinkedList<>();
        for (int i = 0; i < n; i++)
            if (indegree[i] == 0) q.offer(i);
        int[] order = new int[n];
        int idx = 0;
        while (!q.isEmpty()) {
            int node = q.poll();
            order[idx++] = node;
            for (int nei : adj.get(node))
                if (--indegree[nei] == 0) q.offer(nei);
        }
        return idx == n ? order : new int[0];
    }
}`,
timeComplexity:"O(V+E)",spaceComplexity:"O(V+E)",
mistakes:["Returning null instead of empty array for cycle","Not preserving insertion order","Identical to Course Schedule I — just collect the order!"],
trick:"🧠 'Course Schedule I + collect order. Kahn\\'s naturally gives valid topological order. Return empty on cycle.'"
},
{id:73,topic:"Graphs",pattern:"MST / Union-Find",title:"Number of Connected Components",difficulty:"medium",
intuition:"Union-Find: initially n components. Each edge merges two components. Final count = distinct roots.",
visual:"n=5, edges=[[0,1],[1,2],[3,4]]\nUnion(0,1)→4 components\nUnion(1,2)→3 components\nUnion(3,4)→2 components\nAnswer: 2",
steps:["Initialize parent[i]=i, rank[i]=0","For each edge, union the two nodes","Union: find roots, merge smaller rank into larger","Count distinct roots at end","Or simply count = n - successful unions"],
code:`class Solution {
    int[] parent, rank;
    public int countComponents(int n, int[][] edges) {
        parent = new int[n]; rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
        int components = n;
        for (int[] e : edges)
            if (union(e[0], e[1])) components--;
        return components;
    }
    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }
    boolean union(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;
        if (rank[ra] < rank[rb]) parent[ra] = rb;
        else if (rank[ra] > rank[rb]) parent[rb] = ra;
        else { parent[rb] = ra; rank[ra]++; }
        return true;
    }
}`,
timeComplexity:"O(E·α(n)) ≈ O(E)",spaceComplexity:"O(n)",
mistakes:["Not using path compression (find is slow)","Not using union by rank (tree becomes linear)","Forgetting that α(n) is nearly O(1) amortized"],
trick:"🧠 'Start with n components. Each successful union reduces by 1. Path compression + rank = near O(1) per op.'"
},
{id:74,topic:"Graphs",pattern:"Dijkstra (Weighted)",title:"Network Delay Time",difficulty:"medium",
intuition:"Dijkstra from source node. Find shortest path to all nodes. Answer = max of all shortest paths.",
visual:"1→2(1), 2→3(1), 1→3(4)\nDijkstra from 1: dist[1]=0, dist[2]=1, dist[3]=2\nMax delay = 2 (node 3 receives last)",
steps:["Build adjacency list with weights","Priority queue: (distance, node)","Process closest unvisited node","Relax edges: if shorter path found → update","Answer = max distance, or -1 if unreachable"],
code:`class Solution {
    public int networkDelayTime(int[][] times, int n, int k) {
        List<int[]>[] adj = new List[n + 1];
        for (int i = 0; i <= n; i++) adj[i] = new ArrayList<>();
        for (int[] t : times) adj[t[0]].add(new int[]{t[1], t[2]});
        int[] dist = new int[n + 1];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[k] = 0;
        PriorityQueue<int[]> pq = new PriorityQueue<>((a,b) -> a[0]-b[0]);
        pq.offer(new int[]{0, k});
        while (!pq.isEmpty()) {
            int[] cur = pq.poll();
            int d = cur[0], u = cur[1];
            if (d > dist[u]) continue;
            for (int[] e : adj[u]) {
                if (dist[u] + e[1] < dist[e[0]]) {
                    dist[e[0]] = dist[u] + e[1];
                    pq.offer(new int[]{dist[e[0]], e[0]});
                }
            }
        }
        int max = 0;
        for (int i = 1; i <= n; i++) {
            if (dist[i] == Integer.MAX_VALUE) return -1;
            max = Math.max(max, dist[i]);
        }
        return max;
    }
}`,
timeComplexity:"O(E·log V)",spaceComplexity:"O(V+E)",
mistakes:["Not skipping stale entries in priority queue","Using BFS for weighted graph","1-indexed nodes but 0-indexed array"],
trick:"🧠 'Dijkstra = greedy BFS with priority queue. Always process closest node first. Skip stale entries!'"
},
{id:75,topic:"Graphs",pattern:"Bellman-Ford",title:"Cheapest Flights Within K Stops",difficulty:"medium",
intuition:"Modified Bellman-Ford: relax all edges k+1 times (k stops = k+1 edges). Use copy of distances to avoid multi-hop in one iteration.",
visual:"Flights: 0→1(100), 1→2(100), 0→2(500)\nk=1: 0→1→2 = 200 (1 stop) ✓\n      0→2 = 500 (0 stops) ✓\nMin = 200",
steps:["dist array initialized to ∞, dist[src]=0","k+1 iterations of relaxation","In each iteration, copy dist to temp","Relax all edges using temp values","Return dist[dst] or -1"],
code:`class Solution {
    public int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {
        int[] dist = new int[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[src] = 0;
        for (int i = 0; i <= k; i++) {
            int[] temp = dist.clone();
            for (int[] f : flights) {
                if (dist[f[0]] != Integer.MAX_VALUE)
                    temp[f[1]] = Math.min(temp[f[1]], dist[f[0]] + f[2]);
            }
            dist = temp;
        }
        return dist[dst] == Integer.MAX_VALUE ? -1 : dist[dst];
    }
}`,
timeComplexity:"O(k·E)",spaceComplexity:"O(n)",
mistakes:["Not using temp array (allows multi-hop in single iteration)","Using Dijkstra without stop limit","Checking dist[f[0]] == MAX_VALUE to skip unreachable sources"],
trick:"🧠 'Bellman-Ford with k+1 rounds. COPY dist before each round to prevent using same-round updates!'"
},
{id:76,topic:"Graphs",pattern:"Floyd-Warshall",title:"Find the City With Smallest Number of Neighbors",difficulty:"medium",
intuition:"Floyd-Warshall for all-pairs shortest paths. Count reachable cities within distance threshold for each city.",
visual:"4 cities, threshold=4\nAfter Floyd-Warshall:\nCity 0: reaches 1,3 (2 cities)\nCity 3: reaches 0 (1 city) → answer=3",
steps:["Initialize dist matrix from edges","Floyd-Warshall: for each k, try path through k","dist[i][j] = min(dist[i][j], dist[i][k]+dist[k][j])","Count cities reachable within threshold for each city","Return city with smallest count (largest index on tie)"],
code:`class Solution {
    public int findTheCity(int n, int[][] edges, int threshold) {
        int[][] dist = new int[n][n];
        for (int[] r : dist) Arrays.fill(r, 10001);
        for (int i = 0; i < n; i++) dist[i][i] = 0;
        for (int[] e : edges) {
            dist[e[0]][e[1]] = e[2];
            dist[e[1]][e[0]] = e[2];
        }
        for (int k = 0; k < n; k++)
            for (int i = 0; i < n; i++)
                for (int j = 0; j < n; j++)
                    dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
        int res = -1, minCount = n + 1;
        for (int i = 0; i < n; i++) {
            int cnt = 0;
            for (int j = 0; j < n; j++)
                if (i != j && dist[i][j] <= threshold) cnt++;
            if (cnt <= minCount) { minCount = cnt; res = i; }
        }
        return res;
    }
}`,
timeComplexity:"O(n³)",spaceComplexity:"O(n²)",
mistakes:["Wrong loop order: k MUST be outermost loop","Initializing dist to Integer.MAX_VALUE (overflow on addition)","Not initializing dist[i][i] = 0"],
trick:"🧠 'Floyd-Warshall: triple nested loop, K outermost! Try every intermediate node. O(n³) but simple for all-pairs.'"
}
];

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


// Merge all batches into single array
var ALL_QUESTIONS = [].concat(BATCH1, BATCH2, BATCH3, BATCH4, BATCH5, BATCH6, BATCH7, BATCH8, BATCH9, BATCH10);

// Topic metadata
var TOPIC_META = {
  "Arrays": {icon:"📊",color:"#7c3aed"},
  "Strings": {icon:"🔤",color:"#ec4899"},
  "Binary Search": {icon:"🔍",color:"#3b82f6"},
  "Stack": {icon:"📚",color:"#f59e0b"},
  "Recursion": {icon:"🔄",color:"#10b981"},
  "LinkedList": {icon:"🔗",color:"#06b6d4"},
  "Doubly LinkedList": {icon:"⇄",color:"#8b5cf6"},
  "HashMap": {icon:"🗺️",color:"#ef4444"},
  "Trees": {icon:"🌳",color:"#22c55e"},
  "BST": {icon:"🌲",color:"#14b8a6"},
  "Graphs": {icon:"🕸️",color:"#6366f1"},
  "Heap": {icon:"⛰️",color:"#f97316"},
  "Backtracking": {icon:"↩️",color:"#a855f7"},
  "Greedy": {icon:"💰",color:"#eab308"},
  "DP": {icon:"📐",color:"#0ea5e9"},
  "Trie": {icon:"🔠",color:"#d946ef"},
  "Bit Manipulation": {icon:"⚙️",color:"#64748b"}
};
