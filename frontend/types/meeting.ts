export interface Participant {
  id: number;
  name: string;
  email: string | null;
  avatar: string | null;
}

export interface TranscriptSegment {
  id: number;
  speaker_id: number;
  speaker: Participant;
  start_time: number;
  end_time: number;
  text: string;
  sequence: number;
}

export interface ActionItem {
  id: number;
  meeting_id: number;
  assignee_id: number | null;
  assignee: Participant | null;
  title: string;
  description: string | null;
  due_date: string | null;
  completed: boolean;
}

export interface Topic {
  id: number;
  title: string;
  description: string | null;
  timestamp: number | null;
}

export interface Meeting {
  id: number;
  title: string;
  date: string;
  duration_seconds: number;
  summary: string | null;
  participants: Participant[];
  transcript_segments: TranscriptSegment[];
  action_items: ActionItem[];
  topics: Topic[];
}

export interface MeetingListItem {
  id: number;
  title: string;    
  date: string;
  duration_seconds: number;
  summary: string | null;
  participants: Participant[];
}