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
