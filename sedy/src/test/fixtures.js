export const diffHunkWithAccents = `@@ -0,0 +1,1 @@
 +### Conventions & consistence`;

export const diffHunk = `@@ -1,4 +1,6 @@
 {
-    "presets": ["es2015", "stage-0"],
-    "plugins": ["transform-regenerator"]
+    "plugins": [
+        "transform-regenerator",
+        "transform-regenerator"
+    ]
 }
`;

export const diffBlob = `{
    "plugins": [
        "transform-regenerator",
        "transform-regenerator"
    ]
}
`;

export const diffHunkWithQuestionMark = `@@ -0,0 +1,1 @@
 +### Is this real life ?`;

export const diffHunkWithNoNewline = `@@ -1 +1,3 @@
-# sedy-test
\\ No newline at end of file
+# sedy-test
+
+This repository is used to test [sedy](https://github.com/marmelab/sedy).`
