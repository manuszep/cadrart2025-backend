import { ICadrartTeamMember } from '@manuszep/cadrart2025-common';

export type ICadrartTeamMemberWithoutPassword = Omit<ICadrartTeamMember, 'password'>;

export type ICadrartJWTStrategyResponse = { userId: number; username: string };
