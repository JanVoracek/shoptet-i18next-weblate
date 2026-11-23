import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

const FREE_SHIPPING_ITEMS = 3;

export function Cart() {
  const { t } = useTranslation();
  const [items, setItems] = useState(0);
  const missing = FREE_SHIPPING_ITEMS - items;

  return (
    <section>
      <h2>{t('_STOREFRONT_CART_TITLE', 'Shopping cart')}</h2>
      <p>
        {/* `count` triggers plural resolution: en -> _one/_other, cs -> _one/_few/_many/_other */}
        {t('_STOREFRONT_CART_ITEM_COUNT', { count: items, defaultValue_one: 'You have {{count}} item in your cart', defaultValue_other: 'You have {{count}} items in your cart' })}
      </p>
      {missing > 0 && (
        <p>
          {/* <Trans> lets translators move markup around. Named components keep the tags readable in Weblate (avoid void HTML names like <link>, <br>, <img>). */}
          <Trans
            i18nKey="_STOREFRONT_FREE_SHIPPING_HINT"
            count={missing}
            tOptions={{
              defaultValue_one: 'Add <bold>{{count}} more item</bold> to get <terms>free shipping</terms>.',
              defaultValue_other: 'Add <bold>{{count}} more items</bold> to get <terms>free shipping</terms>.',
            }}
            components={{ bold: <strong />, terms: <a href="#shipping" /> }}
          />
        </p>
      )}
      <button type="button" onClick={() => setItems((n) => Math.max(0, n - 1))}>
        {t('_STOREFRONT_DECREASE_QUANTITY_LABEL', 'Remove item')}
      </button>{' '}
      <button type="button" onClick={() => setItems((n) => n + 1)}>
        {t('_STOREFRONT_INCREASE_QUANTITY_LABEL', 'Add item')}
      </button>
    </section>
  );
}
