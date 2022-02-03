import { HttpHeaders, HttpClient, HttpResponse, HttpStatusCode, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//import { time } from 'console';
import { AuthService, User } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostServiceService {
  posts: Post[];
  userPosts: Post[];
  authors: string[];
  endpoint: string = 'http://18.224.23.71:8080';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  userModel: AuthService;

  constructor(private http: HttpClient, public router: Router, userModel: AuthService) {
    this.userModel = userModel;
    this.posts = [];
    this.userPosts = [];
    this.authors = [];
  }

  getPosts(){
    this.posts = [];
    this.userModel.authors = [];
    let api = `${this.endpoint}/posts/getPosts`;
    this.headers.set("Authorization", localStorage.getItem("access_token") as string);
      this.http.get(api, { headers: this.headers }).subscribe((res) => {
        this.posts = new Array((res as any).length);
        this.userModel.authors = new Array((res as any).length);
        for (let i = 0; i < (res as any).length; i++){
          this.posts[(res as any).length-i-1] = new Post(0, "", "", 0, "", "", "");
          this.userModel.authors[(res as any).length-i-1] = "";
        }
        for (let i = 0; i < (res as any).length; i++){
          this.parsePost(this.posts, (res as any)[i], true, (res as any).length - i - 1);
        }
        return true;
        });
  }

  getUserPosts(id: number){
    let api = `${this.endpoint}/posts/getPostsByUserId?id=${id}`;
    this.headers.set("Authorization", localStorage.getItem("access_token") as string);
      this.http.get(api, { headers: this.headers }).subscribe((res) => {
        this.userPosts = [];
        for (let i = 0; i < (res as any).length; i++){
          this.parsePost(this.userPosts, (res as any)[i], false, 0);
        }
        return true;
      });
  }

  parsePost(postsObj: Post[], post: any, toggle: boolean, index: number){
    if (toggle){
       this.userModel.getUserProfileByID(post.authorId, index);
       postsObj[index] = new Post(post.authorId, post.code, post.description, post.id, post.language, post.timestamp, post.title);
    }
    else postsObj.splice(index, 0, new Post(post.authorId, post.code, post.description, post.id, post.language, post.timestamp, post.title));
  }

  getPost(id: number){
    let api = `${this.endpoint}/posts/getPost?id=${id}`;
    this.headers.set("Authorization", localStorage.getItem("access_token") as string);
      this.http.get(api, { headers: this.headers }).subscribe((res) => {
        let data = new Post((res as Post).authorId, (res as Post).code, (res as Post).description, (res as Post).id, (res as Post).language, (res as Post).timestamp, (res as Post).title);
        return data;
      });
  }

  deletePost(id: number){
    let api = `${this.endpoint}/posts/deletePost?id=${id}`;
    this.headers.set("Authorization", localStorage.getItem("access_token") as string);
      this.http.delete(api, { headers: this.headers }).subscribe((res) => {
        this.getPosts();
      });

  }

  savePost(title: string, language: string, description: string, code: string){
    let api = `${this.endpoint}/posts/savePost`;
    let jsonObj = {title: title, description: description, language: language, code: code};
    this.headers = new HttpHeaders({'Content-Type': 'application/json', Authorization: localStorage.getItem("access_token") as string});
    this.http.post(api, jsonObj, {headers: this.headers}).subscribe((res) => {
      this.posts.unshift(new Post((res as Post).authorId, (res as Post).code, (res as Post).description, (res as Post).id, (res as Post).language, (res as Post).timestamp, (res as Post).title));
      this.userModel.authors.unshift(localStorage.getItem("username") as string);
      this.router.navigate(['/']);
    }, (error)=> {
      console.log(error);
    });
  }

  // signUp(username: string, password: string, email: string, bio: string){
  //   let api = `${this.endpoint}/users/createUser`;
  //   let jsonObj = {username: username, password: password, email: email, bio: bio};
  //     this.http.post(api, jsonObj, 
  //       {observe: 'response'}
  //       )
  //       .subscribe(res => {
  //         let toggle = this.signIn(username, password);
  //         return toggle
  //     },
  //     (error: HttpErrorResponse) => {
  //       console.log(error.status)
  //     }); 
      
  // }
}

export class Post {
  authorId: number;
  code: string;
  description: string;
  id: number;
  language: string;
  timestamp: string;
  title: string;

  constructor(authorId: number, code: string, description: string, id: number, language: string, timestamp: string, title: string){
    this.authorId = authorId;
    this.code = code;
    this.description = description;
    this.id = id;
    this.language = language;
    this.timestamp = timestamp;
    this.title = title;
    
  }
}