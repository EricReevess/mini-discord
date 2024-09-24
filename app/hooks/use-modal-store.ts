import { create } from 'zustand';
import { Channel, ChannelType, Server } from '@prisma/client';

export enum ModalType {
  CREATE_SERVER,
  INVITE,
  EDIT_SERVER,
  MEMBERS,
  CREATE_CHANNEL,
  LEAVE_SERVER,
  DELETE_SERVER,
  DELETE_CHANNEL,
  EDIT_CHANNEL,
}

export interface ModalData {
  server?: Server;
  channel?: Channel;
  channelType?: ChannelType;
}

export interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  data: ModalData;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
