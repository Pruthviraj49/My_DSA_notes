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
