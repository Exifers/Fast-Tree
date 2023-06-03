# Summary
This is an experiment at creating high performance tree structures rendering in React.
We provide a tree structure that can access any node or its children in O(1). Then we
must be able to select nodes or duplicate nodes without triggering a minimal amount
of renders.

# Conclusion
We tried use-context-selector. Even though it's possible to render less than 3 nodes
when performing an action, the complexity is still linear because of all the
selectors that take time to execute.
If we'd use Zustand or Recoil, we can expect the same result.
It seems then that a better approach to this problem is to code a tree structure
editor in VanillaJs without React.
