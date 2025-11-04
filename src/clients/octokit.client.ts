import { Octokit } from "@octokit/core";

class OctokitClient {
  private static instance: Octokit;

  private constructor() {}

  static getInstance(): Octokit {
    if (!OctokitClient.instance) {
      OctokitClient.instance = new Octokit();
    }
    return OctokitClient.instance;
  }
}

export const octokit = OctokitClient.getInstance();
