---
path: /articles/rxjs-file-uploads
date: 2019-03-13
title: RxJS File Uploads (Part 1)
subtitle: UI progress updates too!
peek: |
  A common task in frontend development is uploading
  a file provided by the user. Visual feedback on upload progress
  prevents the user from worrying while they wait.
tags: [javascript, angular, rxjs]
imported: true
---

There are a handful of tasks in frontend development that seem pretty trivial at first glance but can quickly consume a few evenings
if you aren't careful. Among these is file uploading: taking a file from the user's machine and transferring it to a remote server.
This may occur for any number of reasons - setting a profile picture, uploading a splash image for an article, storing an archive
of source code, etc. As frontend devs, we don't have to care too much about what's _in_ the file, we just need to get it from point A
to point B.

Since we (the user) are initiating the upload, we can watch its progress without any extra help from the server we're uploading to! Showing
progress in some meaningful way in the UI is an easy way to prevent user frustration ahead of time - users are much less likely to get
impatient or feel like they've made a mistake when they have an easily visible indicator that their upload is progressing as expected.

Today we'll be looking at a workflow using [RxJS](https://github.com/ReactiveX/rxjs) inside an [Angular](https://angular.io/) app, but this
could easily be abstracted to any other library that emits events on upload progress; you could even roll your own using
[XHR events](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/upload) directly if you're feeling up to the task!

Feel free to follow along in an existing project. If you don't have one already, get a basic Angular application started with:

```
npm install -g @angular/cli
ng new file-upload
cd file-upload/src/app
```

## Anatomy of a File Upload

Angular provides `HttpClient` which supports upload progress right out of the box. We'll import `HttpClientModule` in our application
module and then inject `HttpClient` inside our upload service.

###### app/application.module.ts

```ts
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { UploadService } from './services/upload.service';

@NgModule({
  //...
  imports: [
    BrowserModule,
    HttpClientModule,
  ],
  providers: [
    UploadService,
  ],
  //...
})
```

###### app/services/upload.service.ts

```ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class NetworkService {
  constructor(private http: HttpClient) {}
}
```

First things first, we need to get a file to upload. If you're using a visual framework like Angular Material, there is likely a file
input component that will better suit your visual theme, but we'll go with the builtin HTML `<input type="file">` for now. Let's create
a new component that displays a file input and uploads the selected file when the user clicks **Upload**:

```
mkdir components
cd components
ng generate component upload
```

Head into your newly generated component and add the following:

###### app/components/upload/upload.component.ts

```ts
// highlight-range{1,3,11,13,17-25}
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnInit {
  @ViewChild('upload') upload: ElementRef<HTMLInputElement>;

  constructor(private uploadService: UploadService) {}

  ngOnInit() {}

  async handleUpload(): Promise<void> {
    const file = this.upload.nativeElement.files[0];
    if (!file) {
      alert('Please select a file!');
      return;
    }

    await this.uploadService.upload(file);
    alert('Uploaded!');
  }
}
```

###### app/components/upload/upload.component.html

```html
<input type="file" #upload />
<button (click)="handleUpload()">
  Upload
</button>
```

This won't do much since `UploadService` doesn't have an `upload` method. Let's fix that:

###### app/services/upload.service.ts

```ts
// highlight-range{2,7-12}
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';

export class NetworkService {
  constructor(private http: HttpClient) {}

  upload(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    const req = new HttpRequest('POST', `${serverUrl}/file-upload`, formData);
    return this.http.request(req).toPromise();
  }
}
```

Obviously you'll need a server that accepts file uploads at `/file-upload` to actually run this; for now, I'll leave that up to the
reader (but I'll probably write a tutorial on that end of things soon 😉).

Alright, assuming your server is in order, it works! However, if you try to upload a file larger than a few MB, you'll notice that there's no
feedback on the upload's progress; we don't get any visual indication that the file upload is progressing correctly until it completes. That's
no good! Let's hook into the upload progress and report it back to the user.

## Providing Feedback on Upload Progress

Angular's `HttpClient` has upload progress baked in, we just need to enable it with the `reportProgress` flag. Let's set that flag to `true`
and then log out the progress:

###### app/services/upload.service.ts (partial)

```ts
// highlight-range{1,13,17-24}
import { HttpEvent, HttpEventType } from 'angular/common/http';
import { tap } from 'rxjs/operators';

//...

upload(file: File): Promise<any> {
  const formData = new FormData();
  formData.append('file', file);
  const req = new HttpRequest(
    'POST',
    `${serverUrl}/file-upload`,
    formData,
    { reportProgress: true },
  );
  return this.http
    .request(req)
    .pipe(
      tap((event: HttpEvent<any>) => {
        if (event.type !== HttpEventType.UploadProgress) return;

        const progress = Math.round(event.loaded * 100 / event.total);
        console.log('progress:', progress);
      }),
    )
    .toPromise();
}
```

`HttpClient.request()` returns an `Observable` that we can tap into to view progress events. If you reload the app and upload a file,
you should see something like the following in your log:

```
progress: 20
progress: 85
progress: 100
```

Great! We're not crazy, the file really is uploading and we have tangible proof. It's unlikely that our users will be watching their console,
however, so let's get that progress back to the UI.

## Displaying Progress in the UI

Head back over to your `upload` component and add in a `<progress>` element to display the file upload's progress:

###### app/components/upload/upload.component.html

```html
<input type="file" #upload />
<progress [value]="progress" max="100"></progress> // highlight-line
<button (click)="handleUpload()">
  Upload
</button>
```

###### app/components/upload/upload.component.ts (partial)

```ts
export class UploadComponent implements OnInit {
  // highlight-range{4,13-17}
  //...

  progress = 0;

  async handleUpload(): Promise<void> {
    const file = this.upload.nativeElement.files[0];
    if (!file) {
      alert('Please select a file!');
      return;
    }

    await this.uploadService.upload(file, progress => {
      this.progress = progress;
    });

    this.progress = 0;
    alert('Uploaded!');
  }
}
```

We'll modify our `upload` method in `UploadService` to accept a callback to report the upload's progress back to the caller:

###### app/services/upload.service.ts (partial)

```ts
// highlight-range{1,12}
upload(file: File, onProgress: (p: number) => void): Promise<any> {

  //...

  return this.http
    .request(req)
    .pipe(
      tap((event: HttpEvent<any>) => {
        if (event.type !== HttpEventType.UploadProgress) return;

        const progress = Math.round(event.loaded * 100 / event.total);
        onProgress(progress);
      }),
    )
    .toPromise();
}
```

## Conclusion

Cool. Reload the application, upload a file, and watch as your UI updates before your very eyes! We now have a file uploader that displays
its progress to the user in an easily visible manner. There are a few more optimizations we could perform, but this is a great start. Check
back tomorrow for **Part 2** where we'll take a look at throttling update events and passing the server's response back to the caller.
