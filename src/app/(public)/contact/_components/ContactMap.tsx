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
          <p className={eyebrowClassName}>Зона роботи</p>
          <h2 className="text-accent mt-2 text-xl font-semibold">
            Київ, Київська область та онлайн по всій Україні
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
          <div className="text-app space-y-3 px-6 py-6 text-sm leading-6 lg:px-8">
            <p>
              Окремого приймального офісу немає — зустрічі призначаються за
              попередньою домовленістю в зручному для вас місці в центрі Києва
              або в Ірпені, Бучі, Броварах.
            </p>
            <p>
              Більшість питань вирішуємо дистанційно: консультація телефоном, у
              Viber/Telegram або відеозв’язком, документи — через «Електронний
              суд» та електронний підпис.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ContactMap;
