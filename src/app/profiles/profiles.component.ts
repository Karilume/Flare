import { Component, OnInit, Input } from '@angular/core';

import { TinderService } from '../services/tinder.service';
import { Profile } from '../models/profile.model';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css']
})
export class ProfilesComponent implements OnInit {

profiles: Profile[]
matchStatus: string;

age_filter_min: number;
age_filter_max: number;

distance_filter: number;

  constructor(private service: TinderService) { }

  ngOnInit(){
    this.getProfiles();
    this.getAgeFilter();
    this.getDistanceFilter();
  }

  getProfiles(){
    this.service.getProfiles().subscribe(data => {
      console.log(data.data.results);
      this.profiles = data.data.results;
    })

    this.scrollToTop();
  }

  likeTinderProfile(id: string, s_number: string){
    this.service.likeProfile(id, s_number).subscribe(data => {
      console.log(data.match);
      if(data.match.following == true){
        this.matchStatus = "Yes!";
      } else {
        this.matchStatus = "No";
      }
      
    })
  }

  passTinderProfile(id: string, s_number: string){
    this.service.passProfile(id, s_number).subscribe(data => {
      console.log(data);
      if(data.status == 200){
        this.matchStatus = "Passed";
      }
    })
  }

  superlikeTinderProfile(id: string, s_number: string){
    this.service.superlikeProfile(id, s_number).subscribe(data => {
      console.log(data.match);
      if(data.match == true){
        this.matchStatus = "Yes!";
      } else {
        this.matchStatus = "No";
      }
      
    })
  }

  removeFromList(profile, status){
    console.log(status);
    let index = this.profiles.indexOf(profile);
    this.profiles.splice(index, 1)
  }

  getAgeFilter(){
    this.service.getUserProfileV2().subscribe(data => {
      console.log("Age min:" + data.data.user.age_filter_min + ", Age max:" + data.data.user.age_filter_max);
      this.age_filter_min = data.data.user.age_filter_min;
      this.age_filter_max = data.data.user.age_filter_max;
    })
  }

  setAgeFilter(){
    this.service.setAgeFilter(this.age_filter_min, this.age_filter_max).subscribe(data => {
      console.log("Changed age filter");
    })
  }

  getDistanceFilter(){
    this.service.getUserProfileV2().subscribe(data => {
      console.log("Distance filter (in miles):" + data.data.user.distance_filter);
      this.distance_filter = data.data.user.distance_filter;
      console.log("Distance filter (in km):" + this.distance_filter * 1.6);
    })
  }

  setDistanceFilter(){
    this.service.setDistanceFilter(this.distance_filter).subscribe(data => {
      console.log("Changed distance filter (in miles): " + this.distance_filter);
      console.log("Changed distance filter (in km): " + this.distance_filter * 1.6);
    })
  }


  scrollToTop(){
    window.scrollTo(0, 0);
  }
}
