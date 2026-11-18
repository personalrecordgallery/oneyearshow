# Gallery

Responsive photo blog with a live gallery and password-protected upload page. Photos uploaded at `/submit.html` appear at the top of the gallery immediately. The live site uses Cloudflare Pages Functions and an R2 bucket; it no longer reads images from the local `images/` folder.

## Set up the hosted site

1. Create a Cloudflare R2 bucket named `gallery`.
2. Put the contents of this `outputs` folder at the root of a GitHub repository. Alternatively, set the Cloudflare Pages **Root directory** to `outputs` if the repository contains this folder.
3. In Cloudflare, create a Pages project connected to that repository. Select **None** for framework preset. Leave the build command blank. Use `.` as the build output directory when the root directory already contains `index.html` and `functions/`.
4. In the Pages project, open **Settings → Bindings → Add → R2 bucket**. Set the variable name to `PHOTO_BUCKET`, select the `gallery` bucket, and save.
5. In **Settings → Variables and Secrets**, add a secret named `UPLOAD_PASSWORD`. Set a long, unique shared password and share it only with people who should upload. Redeploy after adding/changing the binding or secret.
6. Add your custom domain to the Pages project. Open `/submit.html` to upload and `/` to view the gallery.
7. Replace `YOUR_USERNAME` in `index.html` with your Instagram username.

The upload password is checked by the server and is not embedded in the page. Anyone with the shared password can publish images immediately, so share it privately. Uploads accept JPEG, PNG, WebP, and GIF files up to 15 MB. For a larger public group, add Cloudflare rate limiting or account-based sign-in before sharing widely.

## Local editing

Edit HTML as plain text. The live gallery obtains its photos from the deployed R2 bucket, so the gallery appears empty when opened directly from disk. Uploads and photo listing work after deployment and Cloudflare configuration.

## Official setup references

- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/)
- [Pages Functions routing](https://developers.cloudflare.com/pages/functions/routing/)
- [Pages bindings, including R2](https://developers.cloudflare.com/pages/functions/bindings/)
- [R2 pricing](https://developers.cloudflare.com/r2/pricing/)
- [Pages custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
