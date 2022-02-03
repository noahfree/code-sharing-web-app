import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HighlightService } from 'src/app/highlight.service';
import { AuthService } from 'src/app/services/auth.service';
import { PostServiceService } from 'src/app/services/post-service.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  userModel: AuthService;
  postModel: PostServiceService;
  renderer: Renderer2;
  router: Router;
  route: ActivatedRoute;
  code: string | null = null;
  highlighted: boolean = false;
  fontSize: number = 14;
  textSize: string = "14px";
  languageClass: string = "";
  // jsonObj = {"Bash": "shell", "CSS": "css", "C": "c", "C#": "csharp", "C++": "cpp", "Go": "go", "HTML": "html", "Java": "java", "JavaScript": "javascript", "TypeScript": "typescript", "JSON": "json", "PHP": "php", "Ruby": "ruby", "SQL": "sql", "XML": "xml-doc", "YAML": "yaml"};
  jsonObj: any = {shell: "Bash", css: "CSS", c: "C", csharp: "C#", cpp: "C++", go: "Go", html: "HTML", java: "Java", javascript: "JavaScript", typescript: "TypeScript", json: "JSON", php: "PHP", ruby: "Ruby", python: "Python", sql: "SQL", xml: "XML", yaml: "YAML"};

  
  constructor(router: Router, 
    renderer: Renderer2, 
    userModel: AuthService, 
    postModel: PostServiceService,
    private highlightService: HighlightService,
    route: ActivatedRoute
    ) {
      this.userModel = userModel;
      this.postModel = postModel;
      this.renderer = renderer;
      this.router = router;
      this.route = route;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if (localStorage.getItem("post-origin") == "home"){
        this.code = this.postModel.posts[params['index']].code;
        console.log(this.postModel.posts[params['index']].language)
        let identifier = this.postModel.posts[params['index']].language;
        if (identifier != "other"){
          this.languageClass = "language-" + identifier;
        }
        else {
          this.languageClass = "language-java";
        }
      }
      else {
        this.code = this.postModel.userPosts[params['index']].code;
        let identifier = this.postModel.userPosts[params['index']].language;
        if (identifier != "other"){
          this.languageClass = "language-" + identifier;
        }
        else {
          this.languageClass = "language-java";
        }
      }
      localStorage.removeItem("post-origin");
    });
  }

  shrinkText(){
    if (this.fontSize > 8){
      this.fontSize--;
      this.textSize = this.fontSize + "px";
    }
  }
  enlargeText(){
    if (this.fontSize < 24){
      this.fontSize++;
      this.textSize = this.fontSize + "px";
    }
  }

  ngAfterViewChecked() {
    setTimeout(() =>{
      if (!this.highlighted){
        this.highlightService.highlightAll();
        this.highlighted = true;
      }
    }, 700)
   }
}
