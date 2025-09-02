import NetInfo from '@react-native-community/netinfo';

// Network Service for online/offline detection
export interface NetworkState {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string | null;
}

class NetworkService {
  private static instance: NetworkService;
  private currentState: NetworkState | null = null;

  private constructor() {}

  static getInstance(): NetworkService {
    if (!NetworkService.instance) {
      NetworkService.instance = new NetworkService();
    }
    return NetworkService.instance;
  }

  async getCurrentState(): Promise<NetworkState> {
    const state = await NetInfo.fetch();
    this.currentState = {
      isConnected: state.isConnected ?? false,
      isInternetReachable: state.isInternetReachable,
      type: state.type
    };
    return this.currentState;
  }

  async isOnline(): Promise<boolean> {
    const state = await this.getCurrentState();
    return state.isConnected && state.isInternetReachable === true;
  }

  subscribeToNetworkChanges(callback: (state: NetworkState) => void) {
    return NetInfo.addEventListener(state => {
      const networkState: NetworkState = {
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable,
        type: state.type
      };
      this.currentState = networkState;
      callback(networkState);
    });
  }

  getCachedState(): NetworkState | null {
    return this.currentState;
  }
}

export const networkService = NetworkService.getInstance();
