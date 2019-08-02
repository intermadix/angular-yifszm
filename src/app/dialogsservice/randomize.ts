import { Marketingplannerevents } from '../shared/';

export interface Randomizer {
    randomize: boolean;
    time: string;
    date: string;
    startdate: Date;
    enddate: Date;
    dayoftheweek;
    starthour: string;
    endhour: string;
    campaignLists;
    mailingLists;
    templatemailing;
    Selcampaignlists;
    Seltemplatemailing;
    Selmailinglists;
    addtomailing: false;
    timezone: string;
    followupmailing: string;
    followupdays: number;
    openclickedorall: string;
    Mailing;
}
