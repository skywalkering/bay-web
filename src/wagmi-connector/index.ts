// Copyright 2017-2022 @subwallet/wagmi-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  Chain,
  ConnectorNotFoundError,
  InjectedConnector,
  ResourceUnavailableError,
  RpcError,
  UserRejectedRequestError,
} from "@wagmi/core";
import { InjectedConnectorOptions } from "@wagmi/core/dist/declarations/src/connectors/injected";

export interface WagmiSubConnectOptions extends InjectedConnectorOptions {}

type WagmiConstructorParams = {
  chains?: Chain[];
  options?: WagmiSubConnectOptions;
};

export class SubWalletConnector extends InjectedConnector {
  override readonly id = "subwallet";
  override readonly ready = typeof window != "undefined" && !!window.SubWallet;

  constructor({ chains, options: _options }: WagmiConstructorParams = {}) {
    super({
      chains,
      options: {
        name: "SubWallet",
        shimDisconnect: true,
        shimChainChangedDisconnect: true,
        ..._options,
      },
    });
  }

  async connect({ chainId }: { chainId?: number } = {}) {
    try {
      const provider = await this.getProvider();
      if (!provider) throw new ConnectorNotFoundError();

      if (provider.on) {
        provider.on("accountsChanged", this.onAccountsChanged);
        provider.on("chainChanged", this.onChainChanged);
        provider.on("disconnect", this.onDisconnect);
      }

      this.emit("message", { type: "connecting" });

      const account = await this.getAccount();
      // Switch to chain if provided
      let id = await this.getChainId();
      let unsupported = this.isChainUnsupported(id);

      if (chainId && id !== chainId) {
        const chain = await this.switchChain(chainId);
        id = chain.id;
        unsupported = this.isChainUnsupported(id);
      }

      return { account, chain: { id, unsupported }, provider };
    } catch (e) {
      if (this.isUserRejectedRequestError(e))
        throw new UserRejectedRequestError(e);
      if ((<RpcError>e).code === -32002) throw new ResourceUnavailableError(e);

      throw e;
    }
  }

  async getProvider() {
    if (typeof window === "undefined") return;

    return window.SubWallet;
  }
}
