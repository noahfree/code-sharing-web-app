import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpClientModule, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { Router } from '@angular/router';
import { Post, PostServiceService } from './post-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authors: string[];
  endpoint: string = 'http://18.224.23.71:8080';
  headers = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', 'true');
  currentUser: User | null;
  profile: User | null;
  profileId: number;

  constructor(private http: HttpClient, public router: Router) 
  { 
    this.authors = [];
    this.currentUser = null;
    this.profile = null;
    this.profileId = -1;
    let token = localStorage.getItem("access_token");
  }
  
  signUp(username: string, password: string, email: string, bio: string){
    let api = `${this.endpoint}/users/createUser`;
    let jsonObj = {username: username, password: password, email: email, bio: bio};
      this.http.post(api, jsonObj, 
        {observe: 'response'}
        )
        .subscribe(res => {
          let toggle = this.signIn(username, password);
          return toggle
      },
      (error: HttpErrorResponse) => {
        console.log(error.status)
      }); 
      
  }
  
  signIn(user: string, pass: string) {
    this.http.post(`${this.endpoint}/authentication/generateToken`, {username: user, password: pass})
      .subscribe((res:any) =>
      { 
        if (res != null){
          localStorage.setItem('access_token', res.token);
          localStorage.setItem("username", user);
          this.getUserProfile(user);
          localStorage.setItem('loggedIn', 'true');
          this.router.navigate(['/create-account']);
        }
        else {
          localStorage.setItem('displayPrompt', 'yes');
          localStorage.setItem('loggedIn', 'false');
          this.router.navigate(['/create-account']);
        }
      }, (error: any) => {
        localStorage.setItem('displayPrompt', 'yes');
        localStorage.setItem('loggedIn', 'false');
        this.router.navigate(['/create-account']);
      }); 
  }

  isSignedIn(): boolean {
    let authToken = localStorage.getItem("access_token");
    if (authToken !== null) {
      this.currentUser = this.getUserProfile(localStorage.getItem("username") as string) as unknown as User;
      return true;
    }
    return false;
  }

  doSignOut() 
  {
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");
    this.currentUser = null;
  }

  async getUserProfile(name: String) 
  {
    let api = `${this.endpoint}/users/getUserByName?username=${name}`;
    this.headers.set("Authorization", localStorage.getItem("access_token") as string);
    this.http.get(api, { headers: this.headers }).subscribe(async (res) => {
      // this.authors.unshift((res as any).username);
      // this.currentUser = new User((res as any).id, (res as any).username, (res as any).email, (res as any).bio);
      // console.log(this.currentUser);
      // return true;
      });
      // return false;
      // catchError(this.handleError)
  }

  setUserID(name: string){
    let api = `${this.endpoint}/users/getUserByName?username=${name}`;
    this.headers.set("Authorization", localStorage.getItem("access_token") as string);
    this.http.get(api, { headers: this.headers }).subscribe(async (res) => {
      this.profileId = (res as any).id;
      });
  }

  async setUserProfile(name: String){
    let api = `${this.endpoint}/users/getUserByName?username=${name}`;
    this.headers.set("Authorization", localStorage.getItem("access_token") as string);
    this.http.get(api, { headers: this.headers }).subscribe(async (res) => {
      this.profile = new User((res as any).id, (res as any).username, (res as any).email, (res as any).bio);
      });
  }

  async getUserProfileByID(id: number, index: number) 
  {
    let api = `${this.endpoint}/users/getUserById?id=${id}`;
    this.headers.set("Authorization", localStorage.getItem("access_token") as string);
    this.http.get(api, { headers: this.headers }).subscribe(async (res) => {
      this.authors[index] = (res as any).username;
      });
  }

  getToken() 
  {
    return localStorage.getItem('access_token');
  }

  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }
}

export class User {
  id: number;
  username: string;
  email: string;
  bio: string;

  constructor(id: number, username: string, email: string, bio: string) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.bio = bio;
  }
}