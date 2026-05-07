/**
 * Tipos TypeScript para Integração Jitsi Meet
 * Versão: 1.0
 */

export interface JitsiConfig {
  serverUrl: string;
  roomName: string;
  displayName: string;
  jwt?: string;
  userInfo?: {
    displayName: string;
    email?: string;
    affiliation?: string;
  };
  configOverwrite?: Record<string, any>;
  interfaceConfigOverwrite?: Record<string, any>;
}

export interface Participant {
  id: string;
  displayName: string;
  isAudioMuted: boolean;
  isVideoMuted: boolean;
  isModerator: boolean;
  avatar?: string;
  character?: CharacterInfo;
}

export interface CharacterInfo {
  name: string;
  class: string;
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  level?: number;
  experience?: number;
}

export interface JitsiEvent {
  type: JitsiEventType;
  data: Record<string, any>;
  timestamp: number;
}

export enum JitsiEventType {
  CONFERENCE_JOINED = 'CONFERENCE_JOINED',
  CONFERENCE_LEFT = 'CONFERENCE_LEFT',
  CONFERENCE_FAILED = 'CONFERENCE_FAILED',
  PARTICIPANT_JOINED = 'PARTICIPANT_JOINED',
  PARTICIPANT_LEFT = 'PARTICIPANT_LEFT',
  AUDIO_MUTED_CHANGED = 'AUDIO_MUTED_CHANGED',
  VIDEO_MUTED_CHANGED = 'VIDEO_MUTED_CHANGED',
  DISPLAY_NAME_CHANGED = 'DISPLAY_NAME_CHANGED',
  DOMINANT_SPEAKER_CHANGED = 'DOMINANT_SPEAKER_CHANGED',
  SCREEN_SHARE_STARTED = 'SCREEN_SHARE_STARTED',
  SCREEN_SHARE_ENDED = 'SCREEN_SHARE_ENDED',
}

export interface ConferenceState {
  conferenceId: string;
  roomName: string;
  isConnected: boolean;
  isConnecting: boolean;
  participants: Participant[];
  localParticipant: Participant | null;
  error: JitsiError | null;
  startTime: number | null;
  duration: number;
}

export enum JitsiErrorCode {
  INITIALIZATION_FAILED = 'INITIALIZATION_FAILED',
  CONFERENCE_FAILED = 'CONFERENCE_FAILED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  INVALID_CONFIG = 'INVALID_CONFIG',
  UNKNOWN = 'UNKNOWN',
}

export class JitsiError extends Error {
  constructor(
    public code: JitsiErrorCode,
    public message: string,
    public originalError?: Error,
  ) {
    super(message);
    this.name = 'JitsiError';
  }
}

export interface ConferenceEventListener {
  onConferenceJoined?: () => void;
  onConferenceLeft?: () => void;
  onConferenceFailed?: (error: JitsiError) => void;
  onParticipantJoined?: (participant: Participant) => void;
  onParticipantLeft?: (participantId: string) => void;
  onAudioMutedChanged?: (participantId: string, isMuted: boolean) => void;
  onVideoMutedChanged?: (participantId: string, isMuted: boolean) => void;
  onDisplayNameChanged?: (participantId: string, displayName: string) => void;
  onDominantSpeakerChanged?: (participantId: string) => void;
  onScreenShareStarted?: (participantId: string) => void;
  onScreenShareEnded?: (participantId: string) => void;
}

export interface RetryStrategy {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  component: string;
  message: string;
  data?: Record<string, any>;
  error?: Error;
}

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}
