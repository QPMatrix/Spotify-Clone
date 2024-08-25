export interface PayloadType {
  email: string;
  userId: string;
  artistId?: string;
}
export type EnableTwoFactorAuthPayload = {
  secret: string;
};
