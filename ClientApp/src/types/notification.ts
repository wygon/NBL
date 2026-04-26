export interface NotificationDto {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  created: string;
  redirectUrl?: string;
}