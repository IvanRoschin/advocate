import { eyebrowClassName, panelClassName } from './contact.styles';

type Props = {
  mapEmbedUrl?: string;
  address: string;
};

const ContactMap = ({ mapEmbedUrl, address }: Props) => {
  return (
    <section className="container pb-14">
      <div className={`${panelClassName} overflow-hidden`}>
        <div className="border-border border-b px-6 py-5 lg:px-8">
          <p className={eyebrowClassName}>Локація</p>
          <h2 className="text-accent mt-2 text-xl font-semibold">
            Як нас знайти
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">{address}</p>
        </div>

        {mapEmbedUrl ? (
          <div className="h-95 w-full">
            <iframe
              src={mapEmbedUrl}
              title="Мапа офісу"
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full border-0"
            />
          </div>
        ) : (
          <div className="bg-muted flex h-95 items-center justify-center px-6 text-center">
            <div>
              <p className="text-accent text-lg font-semibold">Мапа офісу</p>
              <p className="text-muted-foreground mt-2 max-w-md text-sm leading-6">
                Додайте `mapEmbedUrl`, коли буде готовий embed URL з Google
                Maps.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ContactMap;
