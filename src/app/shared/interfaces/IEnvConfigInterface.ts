export default interface IEnvConfigInterface {
    HTTP_TIMEOUT: string;
    HTTP_MAX_REDIRECTS: string;
    SITE_URL: string;
    [key: string]: string;
}