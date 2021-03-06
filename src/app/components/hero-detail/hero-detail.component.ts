import { Component, OnInit } from '@angular/core';
import { Hero } from 'src/app/classes/hero';
import { ActivatedRoute } from '@angular/router';
import { HeroService } from 'src/app/services/hero-fire.service';
import { Location } from '@angular/common';
import { Attachment } from 'src/app/classes/attachment';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {
  hero: Hero;

  // for fileUpload
  selectedFiles: FileList;
  isHeroImageUpload = false;
  currentFile: Attachment;
  progress: {percentage: number} = {percentage: 0};

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = +this.route.snapshot.paramMap.get('id'); // url 형식 : /detail/:id (app-routing.module.ts에서 확인)
    // 데이터 없는 sample url : http://localhost:4200/detail/10
    this.heroService.getHero(id) // >> 404 error // .getHeroNo404<Hero>(id) // >> no error
      .subscribe(hero => this.hero = hero);
  }

  goBack(): void {
    this.location.back();
  }

  updateHero(): void {
    this.heroService.updateHero(this.hero).then(
      _ => {
        this.goBack();
      }
    );
  }

  uploadCompleteCallback(event: any) {
    const fileInfo = event.value as Attachment;
    this.hero.imageKey = fileInfo.key;
    this.hero.imageUrl = fileInfo.url;
    this.heroService.updateHero(
      this.hero
    ).then(_ => this.goBack());
  }
}
