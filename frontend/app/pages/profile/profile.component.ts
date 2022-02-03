import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HighlightService } from 'src/app/highlight.service';
import { AuthService, User } from 'src/app/services/auth.service';
import { Post, PostServiceService } from 'src/app/services/post-service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css', '../home/home.component.css']
})
export class ProfileComponent implements OnInit {
  userModel: AuthService;
  postModel: PostServiceService;
  renderer: Renderer2;
  router: Router;
  route: ActivatedRoute;
  currentUser: User;
  username: string;
  posts: Post[] = [];
  author: User;
  highlighted: boolean = false;
  highlightService: HighlightService;


  constructor( router: Router, builder: FormBuilder, renderer: Renderer2, route:ActivatedRoute, userModel: AuthService, postModel: PostServiceService, highlightService: HighlightService) {
    this.userModel = userModel;
    this.postModel = postModel;
    this.renderer = renderer;
    this.router = router; 
    this.route = route;
    this.currentUser = this.userModel.currentUser as User;
    this.author = new User(-1, "", "", "");
    this.username = "";

    this.highlightService = highlightService;
  }

  ngOnInit(): void {
    this.username = localStorage.getItem("username")!;
    if (this.userModel.profile != null){
      this.posts = this.postModel.userPosts;
      this.author = this.userModel.profile as User;
    }
    else {
      this.route.params.subscribe((params: Params) => {
        this.postModel.getUserPosts(params['id']);
        setTimeout(() =>{
          if (this.postModel.userPosts == null || this.userModel.profile == null){
            this.router.navigate(['/']);
          }
          this.posts = this.postModel.userPosts;
          this.author = this.userModel.profile as User;
        }, 2500)
        this.router.navigate(['/profile/' + params['id']]);
        //   this.author = this.userModel.getUserProfileByID(params['id']) as unknown as string;
        //   this.pageTitle = this.author + " Posts";
        // });
      });
    }
  }

  ngAfterViewChecked() {
    setTimeout(() =>{
      if (!this.highlighted){
        this.highlightService.highlightAll();
        this.highlighted = true;
      }
    }, 5000)
    
   }

   deletePost(postId: number, index: number){
    this.postModel.deletePost(postId);
    this.posts.splice(index, 1);
   }

   routeFromProfile(){
    localStorage.setItem("post-origin", "profile");
   }
}
