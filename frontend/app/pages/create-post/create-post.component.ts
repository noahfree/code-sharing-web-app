import { Component, OnInit, Renderer2 } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PostServiceService } from 'src/app/services/post-service.service';


@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  userModel: AuthService;
  postModel: PostServiceService;
  renderer: Renderer2;
  router: Router;
  
  createPostForm: FormGroup = new FormGroup({key: new FormControl()});

  constructor(private render: Renderer2, private route: Router, userModel: AuthService, postModel: PostServiceService) { 
    this.userModel = userModel;
    this.postModel = postModel;
    this.renderer = render;
    this.router = route;
    if (localStorage.getItem("access_token") == null) {
      this.router.navigate(['/create-account']);
    }
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.createPostForm = new FormGroup({
		'title': new FormControl(null, [Validators.required]),
		'description': new FormControl(null, [Validators.required]),
		'code': new FormControl(null, [Validators.required]),
		'language': new FormControl(null, [Validators.required])
    });
  }

  onSubmit() {
    console.log(this.createPostForm.getRawValue());
    let title = this.createPostForm.value['title'];
    let description = this.createPostForm.value['description'];
    let code = this.createPostForm.value['code'];
    let language = this.createPostForm.value['language'];
    console.log(title, language, description, code);
    this.postModel.savePost(title, language, description, code);
    this.createPostForm.reset();
    // this.router.navigate
    
  }


}
