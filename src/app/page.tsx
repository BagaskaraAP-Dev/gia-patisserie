import { CartBar, ChatAdminButton } from "@/components/cart-controls";
import { CheckoutDialog } from "@/components/checkout-dialog";
import { OrderUiProvider } from "@/components/order-ui";
import { Contact, HowToOrder, Intro, MenuSection, SiteFooter } from "@/components/sections";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <OrderUiProvider>
      <SiteHeader />
      <main id="top">
        <Intro />
        <MenuSection />
        <HowToOrder />
        <Contact />
      </main>
      <SiteFooter />
      <CartBar />
      <ChatAdminButton />
      <CheckoutDialog />
    </OrderUiProvider>
  );
}
