import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PostServiceService } from 'src/app/services/post-service.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {
	userModel: AuthService;
	postModel: PostServiceService;
	createAccountForm: FormGroup = new FormGroup({key: new FormControl()});
	renderer: Renderer2;
	router: Router;
	emailInvalid: boolean = false;
	match: boolean = true;
	successful = true;
	loading = true;
  
  constructor(private render: Renderer2, private route: Router, userModel: AuthService, postModel: PostServiceService) { 
	this.userModel = userModel;
    this.postModel = postModel;
    this.renderer = render;
	this.router = route;
  }
  @ViewChild('profilePic') myInputVariable!: ElementRef;

  ngOnInit(): void {
	this.initializeForm();
    if (localStorage.getItem("displayPrompt") != null){
      localStorage.removeItem('displayPrompt');
      alert("Account does not exist. Please create a new account or verify credentials.");
    }
	if (localStorage.getItem("loggedIn") == "true"){
		this.router.navigate(['/']);
	}
  }

  initializeForm(): void {
    this.createAccountForm = new FormGroup({
		'username': new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
		'password': new FormControl(null, [Validators.required, Validators.pattern('(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}')]),
		'confirm': new FormControl(null, [Validators.required]),
		'email': new FormControl(null, [Validators.required, Validators.email]),
		'bio': new FormControl(null, [Validators.required])
    });
  }

  emailValid(){
	  if (this.createAccountForm.get('email')?.status == "INVALID"){
		this.emailInvalid = true;
	  } else {
		  this.emailInvalid = false;
	  }
  }

  passwordMatch() {
	  let password = this.createAccountForm.get('password')?.value;
	  let confirm = this.createAccountForm.get('confirm')?.value;

	  if (password != '' && confirm != ''){
		  this.match = true;
		  if (password == confirm){
			this.match = true;
		  } else {
			  this.match = false;
		  }
	  } else {
		  this.match = true
	  }
  }

  onSubmit() {
	console.log(this.createAccountForm)
    let username = this.createAccountForm.value['username'];
    let password = this.createAccountForm.value['password'];
    let confirm = this.createAccountForm.value['confirm'];
    let email = this.createAccountForm.value['email'];
    let bio = this.createAccountForm.value['bio'];
	if (password == confirm){
		let toggle = this.userModel.signUp(username, password, email, bio);
	}
	this.loading = true
	setTimeout(() => {
		if (localStorage.getItem("access_token") != null) {
			this.successful = true
			this.router.navigate(['/']);
		} else {
			this.successful = false;
		}
		this.loading = false;
	}, 2000)

  }

  url: any; 
	msg = "";
	

	selectFile(event: any) { 
		if(!event.target.files[0] || event.target.files[0].length == 0) {
			this.msg = 'You must select an image';
			return;
		}
		
		var mimeType = event.target.files[0].type;
		
		if (mimeType.match(/image\/*/) == null) {
			this.msg = "Only images are supported";
			return;
		}
		
		var reader = new FileReader();
		reader.readAsDataURL(event.target.files[0]);
		
		reader.onload = (_event) => {
			this.msg = "";
			this.url = reader.result; 
		}
    console.log(this.url)
	}
  
  clearFile(){
    this.myInputVariable.nativeElement.value = "";
    this.url = ""
  }

}
