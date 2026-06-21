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
