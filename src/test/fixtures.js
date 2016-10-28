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
