import { Component, OnInit, Input } from '@angular/core';
import {
  LoopBackConfig,
  PublicationsApi,
  Publications,
  BASE_URL,
  API_VERSION,
  Container,
  ContainerApi,
  Translation,
  TranslationApi,
  Translationjob,
  TranslationjobApi,
  Relations,
  RelationsApi,
  Account,
  AccountApi,
  Company,
  CompanyApi,
  ChannelsApi,
  Files,
  Mailing,
  MailingApi,
  MailinglistApi,
  Mailinglist,
  GoogleanalyticsApi,
  Googleanalytics,
  MarketingplannereventsApi,
  Marketingplannerevents,
  Adwords,
  AdwordsApi,
  timezones,
} from '../../shared/';
import { DialogsService } from './../../dialogsservice/dialogs.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { TextEditorDialog } from './../maileditor/texteditordialog.component';
import { WordpressService } from '../../shared/websiteservice';

@Component({
  selector: 'app-marketingpublications',
  templateUrl: './marketingpublications.component.html',
  styleUrls: ['./marketingpublications.component.scss']
})
export class MarketingpublicationsComponent implements OnInit {

  @Input() Account: Account = new Account();
  @Input() SelectedRelation: Relations;
  @Input() option: Relations = new Relations();
  public Publications: Publications[];
  public selectedPublications: Publications;
  public limitresult: 10;
  public numbers = [
    { value: '1', viewValue: '1' },
    { value: '20', viewValue: '20' },
    { value: '30', viewValue: '30' }
  ];


  constructor(
    public PublicationsApi: PublicationsApi,
    public RelationsApi: RelationsApi,
    public dialogsService: DialogsService,
    public WordpressService: WordpressService,
  ) { }

  ngOnInit() {
  }

    // test selection criteria
    getPublicationsList(): void {
      this.RelationsApi.findById(this.option.id, {
        where: {
          date: {
            // gt: Date.now() - this.onemonth,
            limit: 20,
            order: 'date'
          }
        }
      })
        .subscribe((publications: Publications[]) => this.Publications = publications);
    }

    
  // search
  searchGo(name: string): void {
    name = name.charAt(0).toUpperCase() + name.slice(1);
    name = name.trim();
    this.PublicationsApi.find({ where: { or: [{ newstitle: name }, { newstext: name }] } })
      .subscribe((publications: Publications[]) => this.Publications = publications);
  }

    onSelectImage(SelectedImage): void {
    console.log(this.selectedPublications, "onselect")
    // this.selectedPublications.picturename = SelectedImage.name,
      this.selectedPublications.pictureurl = encodeURI(SelectedImage);
      console.log(this.selectedPublications, "onselect");
  }

  // select and set parameters Publications
  onSelect(publications: Publications): void {
    this.selectedPublications = publications;
  }

    // dialog delete on yes activates deletePublications
    public openDialogDelete() {
      this.dialogsService
        .confirm('Delete Relation', 'Are you sure you want to do this?')
        .subscribe(res => {
          this.deletePublications(res);
        });
    }

      // save entry
  savePublication(): void {
    this.RelationsApi.updateByIdPublications(this.option.id, this.selectedPublications.id, this.selectedPublications)
      .subscribe();
  }

    // publish to apps part
    public newpublication(i): void {
      // const publication = this.Translationjob[i];
      const publicationdata: Publications = new Publications();
      // publicationdata.text = publication.translation
      this.RelationsApi.createPublications(this.option, publicationdata)
      .subscribe(res => {console.log(res),
      this.selectedPublications = res});
      // this.selectedIndex = 0;
    }

    newItem(): void {
      this.RelationsApi.createPublications(this.option.id, { 'companyId': this.Account.companyId, 'title': 'New Item' })
        .subscribe(result => {
            this.selectedPublications = result
        });
    }

    
  // delete Publications -> check container?
  deletePublications(selectedOption): void {
    if (selectedOption === true) {
        this.PublicationsApi.deleteById(this.selectedPublications.id)
        .subscribe(res => { this.getPublications();
        })
    }
  }

  getPublications(): void {
    this.RelationsApi.getPublications(this.option.id, {
      order: 'title DESC'
    }).subscribe((publications: Publications[]) => this.Publications = publications);
  }

  
  public postToWordPress(): void {
    this.WordpressService.publishWP(this.selectedPublications.title, this.selectedPublications.text);
    // this.POSTwordpressApi.create(this.selectedPublications).subscribe(res => {
    //  this.error = res});
  }




}
