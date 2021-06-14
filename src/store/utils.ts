import {
  PluginInstance,
  PluginInstanceFileList,
  PluginInstanceList,
  Plugin,
} from "@fnndsc/chrisapi";
import ChrisAPIClient from "../api/chrisapiclient";
import { LocalFile } from "../components/feed/CreateFeed/types";


export function* getPluginFiles(plugin: PluginInstance) {
  const params = { limit: 200, offset: 0 };
  let fileList: PluginInstanceFileList = yield plugin.getFiles(params);
  let files = fileList.getItems();

  while (fileList.hasNextPage) {
    try {
      params.offset += params.limit;
      fileList = yield plugin.getFiles(params);
      files = files.concat(fileList.getItems());
    } catch (e) {
      throw new Error("Error while paginating files");
    }
  }
  return files;
}

export function* getPlugin(pluginName: string) {
  const client = ChrisAPIClient.getClient();
  const pluginLookup: PluginInstanceList = yield client.getPlugins({
    name_exact: pluginName,
  });
  const plugin: Plugin = yield pluginLookup.getItems()[0];
  return plugin;
}

export function* uploadLocalFiles(files: LocalFile[], directory: string) {
  const client = ChrisAPIClient.getClient();
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    yield client.uploadFile(
      {
        upload_path: `${directory}/${file.name}`,
      },
      {
        fname: (file as LocalFile).blob,
      }
    );
  }
}

export function uploadFilePaths(files: LocalFile[], directory: string) {
  let localFilePath = "";
  if (files.length > 1) {
    localFilePath = directory;
  } else localFilePath = `${directory}/`;
  return localFilePath;
}