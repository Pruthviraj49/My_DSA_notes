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
