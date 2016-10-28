export const diffHunk = `@@ -0,0 +1,202 @@
+---
+layout: post
+title: Taking Picture From Webcam Using Canvas
+excerpt: "Taking a picture from a browser using the webcam is not trivial as it may seem. It requires a low supported API and some canvas manipulation. Here is the missing how-to."
+image: /images/blog/webcam.jpg
+author: <a href="http://www.jonathan-petitcolas.com">Jonathan Petitcolas</a>
+canonical: https://www.jonathan-petitcolas.com/2016/08/24/taking-picture-from-webcam-using-canvas.html
+tags:
+- canvas
+- webcam
+---
+
+**Notice:** this post may ask your authorization to use your webcam. This is due to
+live samples embedded in this post.
+
+<figure>
+	<img class="responsive" src="/images/blog/webcam.jpg" alt="Webcam, by David Burillo" title="Webcam, by David Burillo" />
+ <figcaption>
+ <a href="https://www.flickr.com/photos/dgbury/5695679595/in/photolist-9FiR7k-98et2a-98etvR-98hBZ9-6Ed5wT-ohM1Ua-9AMe8t-99gMt-4EtoSE-91enR6-aCLhA-71vCP-93Mxqn-59WYvo-71vAt-3mwzw-7DapU-7NDuqJ-aceHr-6cGRyB-4QK9Ed-4SFKp-33532-R93tf-9AcPZV-6KuEf-o1NMBf-551kGR-oxedo5-ozefa5-ohLnLV-ohL95C-ohL96E-ohL94A-oxedno-ozg5uc-miKhC-4QK9DY-moxg4g-62xZ8c-8gpDB-TY7Ry-vRtD4-5QzXBV-8zNSb-5QEdXL-9muvC-4iLMqg-dtKJqc-e1gAy3">
+ Webcam, by David Burillo
+ </a>
+ </figcaption>
+</figure>
+
+I recently needed to take a picture from a web browser using my webcam. As this is
+a basic need, I thought it would be quite easy. Yet, solution is not trivial, and
+implies both using new user media HTML5 API and some canvas manipulation. Here is
+a reminder which may be useful to everyone.
+
+## Displaying Webcam Stream in Browser
+
+First step is to display the webcam stream into the browser. It is easily done using
+the 'getUserMedia' HTML5 API. [Support is quite limited](http://caniuse.com/#search=getUserMedia)
+(neither supported on Safari / iOS, nor on IE, but supported on Edge, Firefox and
+Chrome). A solution for oldest browsers is to fallback on a Flash solution. However,
+it won't be fixed on mobiles, and we would need to use an extra framework such
+as [PhoneGap](http://phonegap.com/) in this case.
+
+As dealing with fallback would be quite cumbersome, and as we don't want to write
+some ugly prefixed code such as:
+
+''' js
+const getUserMedia = navigator.getUserMedia
+ || navigator.webkitGetUserMedia
+ || navigator.mozGetUserMedia
+ || navigator.msGetUserMedia;
+'''
+
+We are going to use a polyfill written by [@addyosmani](https://www.twitter.com/addyosmani):
+[getUserMedia.js](https://github.com/addyosmani/getUserMedia.js/). It uses either the
+native implementation or Flash fallback depending of browser support. Exactly what
+we need.
+
+First, let's install it (I'm using Webpack, hence the 'save-dev'):
+
+''' sh
+npm install --save-dev getusermedia-js
+'''
+
+Let's now initialize a video stream and display it in the browser using the
+freshly installed package:
+
+''' js
+import { getUserMedia } from 'getusermedia-js';
+
+getUserMedia({
+ video: true,
+ audio: false,
+ width: 640,
+ height: 480,
+ el: 'stream', // render live video in #stream
+ swffile: require('getusermedia-js/dist/fallback/jscam_canvas_only.swf'),
+}, stream => {
+ const video = document.querySelector('#stream video');
+ video.src = window.URL.createObjectURL(stream);
+ video.play();
+}, err => console.error(err));
+'''
+
+We start by calling the 'getUserMedia' polyfill, specifying it we don't care about
+audio, the preview video dimensions, and where to insert it (in the '#stream' element).
+We also specify the path to our Flash fallback (included in the lib). I didn't test
+it as all my installed browsers support this feature, but it should work this way.
+
+Note that if we don't use any module bundler, we need to replace the 'require' call
+by the path of the fallback.
+
+Second and third arguments are respectively success and error callbacks. Let's focus
+on the success handler, as we just log errors in case of failure. Once we get the webcam
+stream, we point the 'video' tag to its URL, retrieved using the 'URL.createObjectURL'
+method. We should not forget to call the 'play' method on our video to prevent
+from being stuck at the first frame.
+
+At this step, we are able to display our webcam stream:
+
+<div class='embed-container' style="padding-bottom: 35rem;">
+ <iframe src="https://www.jonathan-petitcolas.com/labs/webcam-picture/webcam-stream/index.html" height="580" frameborder="0" allowfullscreen></iframe>
+</div>
+
+## Taking a Picture using Canvas and Live Webcam Stream
+
+Now, we need to isolate a single frame into a picture. Principle is not trivial: we need
+to add a 'canvas' element to our page, set the canvas content to current video frame,
+and then convert canvas content to data URL.`;

export const diffHunkWithAccents = `@@ -0,0 +1,1 @@
 +### Conventions & consistence`;

export const simpleDiffHunk = `@@ -1,4 +1,6 @@
 {
-    "presets": ["es2015", "stage-0"],
-    "plugins": ["transform-regenerator"]
+    "plugins": [
+        "transform-regenerator",
+        "transform-regenerator"
+    ]
 }
`;

export const simpleFile = `{
    "plugins": [
        "transform-regenerator",
        "transform-regenerator"
    ]
}
`;
