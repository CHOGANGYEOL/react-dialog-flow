import { useMemo, useSyncExternalStore } from "react";

type PortalContainerOptions = {
  containerSelector?: string;
  portalId?: string;
  className?: string;
  zIndex?: number;
};

function createPortalContainerStore(options: PortalContainerOptions) {
  let container: HTMLElement | null = null;
  let created: HTMLElement | null = null;

  return {
    subscribe(onStoreChange: () => void) {
      const {
        containerSelector,
        portalId = "dialogs-root",
        className,
        zIndex = 999,
      } = options;
      let target = containerSelector
        ? document.querySelector<HTMLElement>(containerSelector)
        : null;
      target ??= document.getElementById(portalId);

      if (!target) {
        target = document.createElement("div");
        target.id = portalId;
        if (className) target.className = className;
        target.style.position = "relative";
        target.style.zIndex = String(zIndex);
        document.body.appendChild(target);
        created = target;
      }

      container = target;
      onStoreChange();

      return () => {
        created?.remove();
        created = null;
        container = null;
        onStoreChange();
      };
    },
    getSnapshot: () => container,
  };
}

export function usePortalContainer(options: PortalContainerOptions) {
  const store = useMemo(
    () => createPortalContainerStore(options),
    [
      options.containerSelector,
      options.portalId,
      options.className,
      options.zIndex,
    ],
  );

  return useSyncExternalStore(store.subscribe, store.getSnapshot, () => null);
}
