import { Configuration, InfoApi, IssuedDocumentsApi } from "@fattureincloud/fattureincloud-ts-sdk";
import { getFicAccessToken } from "./config";

export function createFicApis() {
  const accessToken = getFicAccessToken();
  if (!accessToken) {
    throw new Error("Missing FIC_ACCESS_TOKEN (or FATTUREINCLOUD_ACCESS_TOKEN)");
  }
  const configuration = new Configuration({ accessToken });
  return {
    issuedDocuments: new IssuedDocumentsApi(configuration),
    info: new InfoApi(configuration),
  };
}
