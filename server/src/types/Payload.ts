export interface PayloadType {
  userId: string;
  email: string;
  artistId?: string;
}
export type EnableTwoFactorAuthPayload = {
  secret: string;
};
