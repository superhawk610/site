---
path: /articles/rxjs-file-uploads-2
date: 2019-03-14
title: RxJS File Uploads (Part 2)
subtitle: Now with 100% more pipes!
peek: |
  Now that you're an uploading aficionado, let's take it one
  step further. We'll clean up our UploadService implementation and talk
  about some corner cases you may encounter.
tags: [javascript, angular, rxjs]
imported: true
---

In [Part 1](/articles/rxjs-file-uploads), we built out a basic file upload component using [Angular](https://angular.io/) and
[RxJS](https://github.com/ReactiveX/rxjs). This tutorial will further build on that component, so if you haven't already, go check it out
to get up to speed.

Alright, ready to go? Let's get to it.

## Animating the Progress Bar

What's a good PWA without a touch of animated flair? If you're using an [existing solution](https://github.com/merlosy/ngx-material-file-input)
for displaying progress then you may already have smooth progress animations baked in. If not, no worries, I threw together a quick
[CodeSandbox](https://codesandbox.io/s/j718ov6oy3) with an example animated progress bar component, feel free to grab that.

Here's what our progress bar looked like previously, with no transition animation:

![progress-bar-animation](../images/017-progress-bar.gif)

and here's what it looks like now!

![progress-bar-animated](../images/017-progress-bar-animated.gif)

## Throttling UI Updates

If you're using the component I linked above, it shouldn't have any problem handling progress updates that occur more frequently than it
takes for a single CSS transition animation to take place. However, some more complex components (specifically those using JS to update the UI)
will provide choppy feedback if we cut off an animation before its had time to complete. To solve this, we can use RxJS's `throttleTime`
operator. Let's add it to `UpdateService` like so:

###### app/services/update.service.ts (partial)

```ts
// highlight-range{1,12}
import { tap, throttleTime } from 'rxjs/operators';

//...

upload(file: File, onProgress: (p: number) => void): Promise<any> {

  //...

  return this.http
    .request(req)
    .pipe(
      throttleTime(300),
      tap((event: HttpEvent<any>) => {
        if (event.type !== HttpEventType.UploadProgress) return;

        const progress = Math.round(event.loaded * 100 / event.total);
        onProgress(progress);
      }),
    )
    .toPromise();
}
```

Great! Now our progress updates won't be processed any more than once every `300ms`, which should stop any sort of stuttering in the UI.

## Resolving to the Server Response

According to the documentation for `Observable.toPromise()`, it should resolve the Promise with the last value the observable emitted before
completing. However, I've infrequently encountered the following error when combining `throttleTime()` and `.toPromise()`:

```
message: "no elements in sequence"
name: "EmptyError"
```

In addition to `HttpEventType.UploadProgress` events, `http.request()` will emit a few other events in the following order:

- `0: HttpEventType.Sent`
- `1: HttpEventType.UploadProgress`
- `2: HttpEventType.ResponseHeader`
- `4: HttpEventType.Response`

If the stars align and the final two events come across close to each other (which they often will), `.toPromise()` will resolve with the
`ResponseHeader` event instead of the actual `Response` event; this is no good since we need to know the response body. In essence, we only
need to throttle the `UploadProgress` events and then resolve with the `Response` event. To accomplish this, we'll multicast the request
observable through a `Subject`, which we'll in turn pipe through two different flows:

###### app/services/update.service.ts (partial)

```ts
// highlight-range{1,2,10-29}
import { Subject } from 'rxjs';
import { throttleTime, filter, map } from 'rxjs/operators';

//...

upload(file: File, onProgress: (p: number) => void): Promise<any> {

  //...

  const progress$ = new Subject<HttpEvent<any>>();

  this.http.request(req).subscribe(progress$);

  // Progress Flow
  progress$.pipe(
    filter(e => e.type === HttpEventType.UploadProgress),
    throttleTime(300),
  ).subscribe((event: HttpEvent<any>) => {
    const progress = Math.round(event.loaded * 100 / event.total);
    onProgress(progress);
  });

  // Response Flow
  return progress$
    .pipe(
      filter(e => e.type === HttpEventType.Response),
      map(e => e.body),
    )
    .toPromise();
}
```

We multicast all the events from `http.request()` through `progress$`, then set up two flows to handle the events. In the `Progress Flow`,
we first filter out non-progress events, then throttle those that come through and pass those that do up to `onProgress`. In the
`Response Flow`, we filter for the `Response` event and resolve the Promise with it's `body` property (that contains the response body).

To get that response in the UI component, just await the Promise like so:

###### app/components/upload/upload.component.ts (partial)

```ts
// highlight-range{7-9}
export class UploadComponent implements OnInit {
  //...

  async handleUpload(): Promise<void> {
    //...

    const response = await this.uploadService.upload(file, progress => {
      this.progress = progress;
    });

    //...
  }
}
```

## Conclusion

Congratulations, you made it! You've got a good looking, even better functioning upload component built on a very solid foundation. Use it
well.
