;;-*- coding: utf-8 -*-
;; diffusion-system-authentication-mode.el -- highlighting for Diffusion SystemAuthentication.store files
;;
;; Copyright (C) 2016 Push Technology, Ltd
;; Author: Philip Aston
;; Keywords: faces


(defgroup diffusion-system-authentication-mode nil
  "View Diffusion system authentication files.")

(defgroup diffusion-system-authentication-mode-faces nil
  "Faces for diffusion-system-authentication-mode."
  :prefix "diffusion-system-authentication-"
  :group 'diffusion-system-authentication-mode)

(defface diffusion-system-authentication-delimiter-face
  '((((class color)) (:foreground "gray75")))
  "Face for delimeters."
  :group 'diffusion-system-authentication-faces)

(defcustom diffusion-system-authentication-mode-hook
  nil
  "Normal hook run when starting to view a Diffusion system authentication file."
  :type 'hook
  :group 'diffusion-system-authentication-mode)

(setq diffusion-system-authentication-mode-font-lock-defaults
      (list
       `(,(regexp-opt '(
                        "abstain"
                        "add"
                        "allow"
                        "anonymous"
                        "assign"
                        "connections"
                        "deny"
                        "encrypted"
                        "password"
                        "principal"
                        "roles"
                        "set"
                        "verify"
                        ) 'words) . font-lock-keyword-face)
       `(,(regexp-opt '("," "[" "]")) . 'diffusion-system-authentication-delimiter-face)
        ))

(define-derived-mode diffusion-system-authentication-mode fundamental-mode "Diffusion System Authentication"
  "Major mode for viewing Diffusion system authentication files.
Currently only provides syntax highlighting."
  (setq font-lock-defaults
        '(diffusion-system-authentication-mode-font-lock-defaults nil t))
  (font-lock-fontify-buffer)
  (modify-syntax-entry ?\; "< b")
  (modify-syntax-entry ?\n "> b")
  )

(add-to-list 'auto-mode-alist
             '("SystemAuthentication.store\\'" . diffusion-system-authentication-mode))

(provide 'diffusion-system-authentication-mode)
