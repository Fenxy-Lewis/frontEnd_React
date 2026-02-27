import * as React from "react";
import { Link } from "react-router-dom"; // ប្តូរពី next/link មក react-router-dom

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  MenuIcon,
  BookOpen,
  MessageCircle,
  Info,
  Phone,
  Compass,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { MdElectricBolt } from "react-icons/md";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { VariantProps } from "class-variance-authority";

type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
type IconElement = React.ReactElement<{ size: number; className?: string }>;

type BaseButtonProps = {
  text?: string;
  className?: string;
  variant?: ButtonVariant;
  isVisible?: boolean;
};

type ButtonClickProps = BaseButtonProps & {
  onClick?: () => void;
  urlLink?: never;
};

type ButtonUrlProps = BaseButtonProps & {
  onClick?: never;
  urlLink?: string;
};

type ButtonProps = ButtonClickProps | ButtonUrlProps;

interface NavBar2Props<T extends MenuItem> {
  domain?: {
    name?: string | React.ReactNode;
    logo?: React.ReactNode;
  };
  navigationMenu?: T[];
  isSticky?: boolean;
  authLinks?: {
    login?: ButtonProps;
    register?: ButtonProps;
  };
  leftAddon?: React.ReactNode;
  className?: string;
}

export interface MenuItem {
  title: string;
  url: string;
  subMenu?: SubMenu[];
}

export interface SubMenu {
  title: string;
  description?: string;
  url?: string;
  icon?: React.ReactNode;
}

interface ListItemProps extends React.ComponentPropsWithoutRef<"li"> {
  to: string; // ប្តូរពី href មក to
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const mainMenu: MenuItem[] = [
  {
    title: "Products",
    url: "/products",
    subMenu: [
      {
        title: "All Products",
        url: "/products/all",
        description: "Browse our complete catalog.",
        icon: <ShoppingCart />,
      },
      {
        title: "New Arrivals",
        url: "/products/new",
        description: "Discover the latest additions.",
        icon: <Compass />,
      },
      {
        title: "Categories",
        url: "/products/categories",
        description: "Explore by product type.",
        icon: <LayoutDashboard />,
      },
    ],
  },
  {
    title: "About Us",
    url: "/about",
    subMenu: [
      {
        title: "Our Story",
        url: "/about/story",
        description: "Learn about our mission and values.",
        icon: <BookOpen />,
      },
      {
        title: "Team",
        url: "/about/team",
        description: "Meet the people behind our success.",
        icon: <Users />,
      },
    ],
  },
  {
    title: "Support",
    url: "/support",
    subMenu: [
      {
        title: "Help Center",
        url: "/support/help",
        description: "Find answers to common questions.",
        icon: <MessageCircle />,
      },
      {
        title: "Contact Us",
        url: "/support/contact",
        description: "Get in touch with our support team.",
        icon: <Phone />,
      },
      {
        title: "FAQs",
        url: "/support/faq",
        description: "Frequently Asked Questions.",
        icon: <Info />,
      },
    ],
  },
];

export function NavBar2<T extends MenuItem>(navBar2Props: NavBar2Props<T>) {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const {
    domain = { name: "Bolt Stack" },
    isSticky = true,
    authLinks,
    leftAddon,
    className = "",
    navigationMenu,
    ...props
  } = navBar2Props;

  const defaultLogo = domain.logo || <MdElectricBolt size={26} />;
  const [isClient, setIsClient] = React.useState(false);
  const defaultNavigationMenu = navigationMenu ?? mainMenu;

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isClient]);

  const { login = {} } = authLinks || {};
  const { register = {} } = authLinks || {};
  const {
    className: loginClassName = "",
    isVisible: isLoginVisbile = true,
    onClick: onLoginClicked,
    text: loginText = "Login",
    urlLink: urlLoginUrl = "",
    variant: loginVariant = "ghost",
  } = login;

  const {
    className: registerClassName = "",
    isVisible: isRegisterVisible = true,
    onClick: onRegisterClicked,
    text: registerText = "Register",
    urlLink: urlRegisterUrl = "",
    variant: registerVariant = "default",
  } = register;

  const navBarSticklyTailwindCss = `
        fixed top-0 left-0 right-0 z-50 p-7 py-5 flex justify-between items-center  transition-all duration-300
        ${
          isScrolled
            ? " bg-opacity-30 backdrop-blur-lg shadow-lg py-2 dark:border-b"
            : "py-3"
        }`;

  const RenderMainMenuItem = ({ menuItem }: { menuItem: MenuItem }) => {
    if (menuItem.subMenu && menuItem.subMenu.length > 0) {
      return (
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent">
            {menuItem.title}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-[300px]">
              {menuItem.subMenu.map((subMenuItem) => (
                <ListItem
                  key={subMenuItem.title}
                  title={subMenuItem.title}
                  description={subMenuItem.description}
                  icon={subMenuItem.icon}
                  to={subMenuItem.url || ""} // ប្តូរពី href មក to
                />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      );
    }

    return (
      <NavigationMenuLink asChild>
        <Link to={menuItem.url}>{menuItem.title}</Link>{" "}
        {/* ប្តូរពី href មក to */}
      </NavigationMenuLink>
    );
  };

  const RenderNameAndLogo = ({
    defaultLogo,
  }: {
    defaultLogo: React.ReactNode;
  }) => {
    return (
      <Link to={"/"}>
        {" "}
        {/* ប្តូរពី href មក to */}
        <div className="flex justify-center   items-center gap-2 mt-[5px]">
          {defaultLogo}
          {typeof domain.name === "string" ? (
            <h1 className="text-2xl font-bold max-md:hidden">{domain.name}</h1>
          ) : (
            <div className="flex justify-center   items-center gap-2 mt-[5px]">
              {domain.name}
            </div>
          )}
        </div>
      </Link>
    );
  };

  if (!isClient) return null;

  return (
    <nav
      {...props}
      className={`   ${
        isSticky
          ? navBarSticklyTailwindCss
          : " flex justify-between   items-center p-6 px-20 "
      } ${className}`}
    >
      <RenderNameAndLogo defaultLogo={defaultLogo} />
      <NavigationMenu viewport={false} className="max-lg:hidden mt-2 ">
        <NavigationMenuList>
          {defaultNavigationMenu.map((mainMenuItem) => (
            <RenderMainMenuItem
              key={mainMenuItem.title}
              menuItem={mainMenuItem}
            />
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      <div>
        <RenderMobileMenu defaultLogo={defaultLogo} />
        <div className="flex gap-2 items-center">
          {leftAddon && <div className="max-lg:hidden">{leftAddon}</div>}
          <RenderAuthButton
            className={loginClassName}
            isVisible={isLoginVisbile}
            onClick={onLoginClicked}
            text={loginText}
            urlLink={urlLoginUrl}
            variant={loginVariant}
          />
          <RenderAuthButton
            className={registerClassName}
            isVisible={isRegisterVisible}
            onClick={onRegisterClicked}
            text={registerText}
            urlLink={urlRegisterUrl}
            variant={registerVariant}
          />
        </div>
      </div>
    </nav>
  );

  function RenderMobileMenu({ defaultLogo }: { defaultLogo: React.ReactNode }) {
    return (
      <Sheet>
        <SheetTrigger asChild className="hidden max-lg:block">
          <Button variant={"outline"}>
            <MenuIcon />
          </Button>
        </SheetTrigger>
        <SheetContent className="">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-start gap-2">
              {React.cloneElement(defaultLogo as IconElement)}
            </SheetTitle>
          </SheetHeader>

          <div className="mt-20">
            <Accordion type="single" collapsible>
              {defaultNavigationMenu.map((mainMenuItem) => {
                if (mainMenuItem.subMenu && mainMenuItem.subMenu.length > 0) {
                  return (
                    <AccordionItem
                      key={mainMenuItem.title}
                      value={mainMenuItem.title}
                      className="border-none"
                    >
                      <AccordionTrigger className="text-left font-medium">
                        {mainMenuItem.title}
                      </AccordionTrigger>
                      <AccordionContent className="pb-4">
                        <div className="space-y-2">
                          {mainMenuItem.subMenu.map((subMenuItem) => (
                            <Link
                              key={subMenuItem.title}
                              to={subMenuItem.url || ""} // ប្តូរពី href មក to
                              className=" p-2 flex items-center gap-4 rounded-md hover:bg-accent text-sm"
                            >
                              <div className="text-sm">
                                {React.isValidElement(subMenuItem.icon)
                                  ? React.cloneElement(
                                      subMenuItem.icon as IconElement,
                                      {
                                        size: 17,
                                        className: "text-muted-foreground",
                                      },
                                    )
                                  : subMenuItem.icon}
                              </div>
                              <div>
                                <div className="font-medium">
                                  {subMenuItem.title}
                                </div>
                                {subMenuItem.description && (
                                  <div className="text-muted-foreground text-xs mt-1">
                                    {subMenuItem.description}
                                  </div>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                }

                return (
                  <div key={mainMenuItem.title} className="">
                    <Link
                      to={mainMenuItem.url} // ប្តូរពី href មក to
                      className="block py-4 font-medium hover:text-accent-foreground"
                    >
                      {mainMenuItem.title}
                    </Link>
                  </div>
                );
              })}
            </Accordion>

            <div className="mt-10">
              <RenderAuthButton
                className={loginClassName}
                isVisible={isLoginVisbile}
                onClick={onLoginClicked}
                text={loginText}
                urlLink={urlLoginUrl}
                variant={loginVariant}
                isInSheet={true}
              />
              <RenderAuthButton
                className={registerClassName}
                isVisible={isRegisterVisible}
                onClick={onRegisterClicked}
                text={registerText}
                urlLink={urlRegisterUrl}
                variant={registerVariant}
                isInSheet={true}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }
}

type RequiredButtonsProps = Required<Omit<ButtonProps, "onClick">> & {
  onClick?: () => void;
  isInSheet?: boolean;
};

function RenderAuthButton({
  className,
  isVisible,
  onClick,
  text,
  urlLink,
  variant,
  isInSheet = false,
}: RequiredButtonsProps) {
  return (
    <>
      {isVisible ? (
        <div
          className={`flex items-center space-x-4 ${isInSheet ? "hidden max-lg:flex w-full max-lg:gap-3 max-lg:flex-col" : " block max-lg:hidden"}`}
        >
          {onClick ? (
            <>
              <Button
                onClick={onClick}
                className={`h-10 ${isInSheet && "w-full"} cursor-pointer select-none ${className}`}
                variant={variant}
              >
                <span>{text}</span>
              </Button>
            </>
          ) : (
            <Button
              className={`h-10 ${isInSheet && "w-full mt-5"} cursor-pointer select-none ${className}`}
              variant={variant}
              asChild
            >
              <a className="no-underline" href={urlLink}>
                {text}
              </a>
            </Button>
          )}
        </div>
      ) : (
        <div className="max-lg:hidden"></div>
      )}
    </>
  );
}

function ListItem({
  title,
  description,
  icon,
  children,
  to, // ប្តូរពី href មក to
  ...props
}: ListItemProps) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link
          to={to} // ប្តូរពី href មក to
          className="block   select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none 
          transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0">{icon && <>{icon}</>}</span>
            <div>
              <h3 className="leading-none font-medium text-[15px]">{title}</h3>
              {description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
          </div>

          {children && (
            <p className="mt-2 text-muted-foreground line-clamp-2 text-sm leading-snug">
              {children}
            </p>
          )}
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

export default NavBar2;
